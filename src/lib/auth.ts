import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import EmailProvider from 'next-auth/providers/email';
import { createTransport } from 'nodemailer';

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

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
      authorization: {
        params: {
          scope: 'openid email profile User.Read',
          prompt: 'select_account',
        },
      },
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASSWORD!,
        },
        secure: false, // Use TLS
      },
      from: process.env.SMTP_FROM!,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const transport = createTransport(provider.server);
        
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to Wolthers Travel`,
          text: `Sign in to Wolthers Travel\n\n${url}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Sign in to Wolthers Travel</h2>
              <p>Click the button below to sign in to your account:</p>
              <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Sign in</a>
              <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
            </div>
          `,
        });
        
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Auto-approve @wolthers.com domains
      if (user.email?.endsWith('@wolthers.com')) {
        return true;
      }
      
      // For now, allow all email providers
      // TODO: Add database check for approved users
      return true;
    },
    async session({ session, token }) {
      // Add user role and company info to session
      if (session.user?.email) {
        // Check if user is Wolthers staff
        if (session.user.email.endsWith('@wolthers.com')) {
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
      // Store account info in JWT
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
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
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;