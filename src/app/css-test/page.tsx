export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">  
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CSS Test Page</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tailwind CSS is Working\!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-green-800 font-medium">Success</h3>
              <p className="text-green-600 text-sm">CSS variables and utilities are loaded</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-blue-800 font-medium">Background Colors</h3>
              <p className="text-blue-600 text-sm">Standard Tailwind colors work</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-purple-800 font-medium">Responsive</h3>
              <p className="text-purple-600 text-sm">Grid layout adjusts on mobile</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white">
          <h3 className="text-xl font-bold mb-2">Advanced Features</h3>
          <p>Gradients, rounded corners, shadows, and responsive design all working correctly.</p>
        </div>
      </div>
    </div>
  );
}
