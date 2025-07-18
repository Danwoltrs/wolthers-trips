import { NextAuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';

// Environment-based configuration
const getAuthConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isVercel = process.env.VERCEL_URL;
  
  if (isDevelopment) {
    return {
      url: 'http://localhost:3000',
      domain: 'localhost'
    };
  }
  
  if (isVercel || !process.env.CUSTOM_DOMAIN) {
    return {
      url: 'https://wolthers-trips.vercel.app',
      domain: 'wolthers-trips.vercel.app'
    };
  }
  
  return {
    url: 'https://trips.wolthers.com',
    domain: 'trips.wolthers.com'
  };
};

const authConfig = getAuthConfig();

const providers = [];

// Add Microsoft OAuth if credentials are available
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  const tenantId = process.env.AZURE_AD_TENANT_ID || 'b8218f6f-5191-4a79-8937-fac3bd38ee1c';
  
  providers.push({
    id: 'azure-ad',
    name: 'Azure Active Directory',
    type: 'oauth',
    wellKnown: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: 'openid email profile User.Read',
        prompt: 'select_account',
        response_type: 'code',
      },
    },
    idToken: true,
    checks: ['state'],
    client: {
      authorization_signed_response_alg: 'RS256',
      id_token_signed_response_alg: 'RS256',
    },
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    profile(profile: any) {
      return {
        id: profile.sub || profile.oid,
        name: profile.name,
        email: profile.email || profile.preferred_username,
        image: null,
      };
    },
  } as OAuthConfig<any>);
}

// Email provider disabled until database adapter is implemented
// TODO: Re-enable email provider after implementing Supabase adapter
// if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_FROM) {
//   providers.push(EmailProvider({ ... }));
// }

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user: user?.email, account: account?.provider });
      // Auto-approve @wolthers.com domains
      if (user.email?.endsWith('@wolthers.com')) {
        return true;
      }
      
      // For now, allow all email providers
      return true;
    },
    async session({ session, token }) {
      console.log('Session callback:', { email: session.user?.email });
      // Add user role and company info to session
      if (session.user?.email) {
        // Check for specific global admin
        if (session.user.email === 'daniel@wolthers.com') {
          session.user.role = 'GLOBAL_ADMIN';
          session.user.company = 'Wolthers & Associates';
        }
        // Check if user is Wolthers staff
        else if (session.user.email.endsWith('@wolthers.com')) {
          session.user.role = 'WOLTHERS_STAFF';
          session.user.company = 'Wolthers & Associates';
        } else {
          session.user.role = 'CLIENT';
          session.user.company = 'External';
        }
      }
      
      return session;
    },
    async jwt({ token, account, profile }) {
      console.log('JWT callback:', { account: account?.provider });
      // Store account info in JWT
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      return token;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug in production to see callback errors
};

export default authOptions;