'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-gray-900">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
              alt="Our Store"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl font-bold text-white mb-6">About Us</h1>
              <p className="text-xl text-gray-200">
                We're passionate about bringing you the best products at the best prices.
                Our commitment to quality and customer satisfaction drives everything we do.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2024, we started with a simple mission: to provide high-quality products
                  at affordable prices. What began as a small online store has grown into a trusted
                  destination for shoppers worldwide.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to serve customers across the globe, offering an extensive
                  selection of products that meet the highest standards of quality and reliability.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-lg overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80"
                  alt="Our Store History"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality First",
                  description: "We never compromise on quality, ensuring every product meets our high standards.",
                  image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80"
                },
                {
                  title: "Customer Focus",
                  description: "Your satisfaction is our top priority, and we're committed to providing excellent service.",
                  image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80"
                },
                {
                  title: "Innovation",
                  description: "We constantly evolve and improve to bring you the latest and best products.",
                  image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
                >
                  <div className="relative h-48">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  name: 'John Doe',
                  role: 'CEO & Founder',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80'
                },
                {
                  name: 'Jane Smith',
                  role: 'Head of Operations',
                  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'
                },
                {
                  name: 'Mike Johnson',
                  role: 'Customer Success',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'
                },
                {
                  name: 'Sarah Williams',
                  role: 'Product Manager',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80'
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions or feedback? We'd love to hear from you. Our team is here to help
                and ensure you have the best shopping experience possible.
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 