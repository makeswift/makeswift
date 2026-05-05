import { client} from '@/makeswift/client'
import { MakeswiftComponentSnapshot } from '@makeswift/runtime/client';
import { Slot } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server';

type ParsedUrlQuery = Promise<{ lang: string; path?: string[] }>


export default async function Page(props: { params: ParsedUrlQuery }) {
  const params = await props.params

  const snapshotA = await client.getComponentSnapshot('my-basic-header', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
    allowLocaleFallback: true
  })


  const snapshotB = await client.getComponentSnapshot('my-basic-footer', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
    allowLocaleFallback: true
  })

  const snapshotC = await client.getComponentSnapshot('my-basic-mid-page-slot', {
    siteVersion: getSiteVersion(),
    locale: params.lang,
    allowLocaleFallback: false
  })

  // const snapshotC = await client.getComponentSnapshot('charlie/0', {
  //   siteVersion: 'Working',
  //   locale: params.lang,
  //   allowLocaleFallback: false
  // })


  return (
    <div className="flex flex-col">
      <Slot snapshot={snapshotA} fallback={<></>} label="My Basic Header" />
      <MockPage contentSnapshot={snapshotC} />
      <Slot snapshot={snapshotB} fallback={<></>} label="My Basic Footer" />
    </div>
  )
}

const MockPage = ({ contentSnapshot }: { contentSnapshot: MakeswiftComponentSnapshot }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">Company Name</div>
          <div className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Our Platform
            </h1>
            <Slot snapshot={contentSnapshot} fallback={<></>} label="My Basic Content Slot" />
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing features and solutions for your business needs
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-blue-600">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature {item}</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  This is an amazing platform that has transformed how we do
                  business. Highly recommended!
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold">John Doe</div>
                    <div className="text-sm text-gray-500">CEO, Company {item}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Name</h3>
              <p className="text-gray-400">
                Making the world a better place through innovative solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Business Street</li>
                <li>City, State 12345</li>
                <li>contact@company.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}