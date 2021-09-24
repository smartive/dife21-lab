import { AnimateSharedLayout, motion } from 'framer-motion';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '../../public/logo.svg';
import '../../styles/globals.css';

const navigation = [
  { name: 'Generic Model', href: '/' },
  { name: 'Train Your Own', href: '/training' },
];

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Machine Learning Web App</title>
        <meta name="description" content="Digital Festival 2021 Lab 'Machine Learning Web App'" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="application-name" content="smartive Lab - DiFe 21" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="smartive Lab - DiFe 21" />
        <meta name="description" content='PWA for the smartive DiFe 21 Lab "Machine Learning Web App"' />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 w-full">
            <div className="flex-shrink-0 flex items-center">
              <a href="https://smartive.ch/" target="_blank" rel="noopener noreferrer">
                <Image src={Logo} height={60} width={60} alt="Logo" />
              </a>
            </div>
            <div className="-my-px ml-6 flex flex-1 justify-end space-x-8">
              <AnimateSharedLayout>
                {navigation.map(({ name, href }) => (
                  <Link key={name} href={href} passHref replace>
                    <a
                      className={`inline-flex relative items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent ${
                        pathname === href ? 'text-black' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {name}
                      {pathname === href && (
                        <motion.div
                          layoutId="active-navigation-entry"
                          className="absolute bottom-[-1px] -mx-1 h-[2px] w-full bg-blue-500"
                        />
                      )}
                    </a>
                  </Link>
                ))}
              </AnimateSharedLayout>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
