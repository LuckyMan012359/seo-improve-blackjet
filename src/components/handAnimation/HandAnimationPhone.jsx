import { useMediaQuery } from '@mui/material';
import { getHandAnimationImages } from 'api/onboarding';
import { baseMediaUrl } from 'assets';
import { HandPath } from './HandPath';
import React, { useEffect, useRef, useState, memo } from 'react';

import defaultImg from './phone_screen000.jpg';
// import { Parallax } from 'react-scroll-parallax';
let lastScrollTop = 0;
const HandAnimationPhone = ({ className = '' }) => {
  const handRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  // const imageRef = useRef(null)
  const afterRef = useRef(null);
  // const phoneRef = useRef(null)
  const [ind, setInd] = useState(12);
  const isMobile = useMediaQuery('(max-width : 1049px)');
  const maxZoom = isMobile ? 3 : 1.75;
  const deviation = isMobile ? 0.1 : 0.05;
  const minZoom = isMobile ? 2 : 1;
  // const [scale, setScale] = useState(minZoom);
  const [maxLength, setMaxLength] = useState(0);
  const [images, setImages] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  // const isMobileDevice = useMediaQuery('(max-width : 699px)');
  const fetchImages = async () => {
    let response = await getHandAnimationImages();
    try {
      setImages(response?.data?.data || []);
      setMaxLength(response?.data?.data.length - 1 || 0);
    } catch (error) {
      console.error(error);
      setImages([]);
      setMaxLength(0);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px', // margin around the root
      threshold: isMobile ? 0.1 : 0.3, // percentage of the target's visibility required to trigger the callback
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (handRef.current) {
      observer.observe(handRef.current);
    }

    return () => {
      if (handRef.current) {
        // eslint-disable-next-line
        observer.unobserve(handRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = (event) => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let deltaY = scrollTop - lastScrollTop;
      lastScrollTop = scrollTop;
      // const group = document.getElementById("main-group");
      // const container = document.getElementById("svg-container");
      // if(group && container){
      //     console.log("group",group.getBoundingClientRect())
      //     console.log("container",container.getBoundingClientRect())
      // }
      // console.log("handref",handRef.current.getBoundingClientRect())
      if (isVisible) {
        if (deltaY > 0) {
          // Scrolling down, zoom out
          setInd((ind) => (ind + 4 > maxLength ? maxLength : ind + 4));
          setZoomLevel((zoomLevel) =>
            zoomLevel + deviation > maxZoom ? maxZoom : zoomLevel + deviation,
          ); // Adjust the zoom level as needed
        } else if (deltaY < 0) {
          // Scrolling up, zoom in
          setInd((ind) => (ind - 4 < 0 ? 0 : ind - 4));
          setZoomLevel((zoomLevel) =>
            zoomLevel - deviation < minZoom ? minZoom : zoomLevel - deviation,
          ); // Adjust the zoom level as needed
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, maxLength]);

  // const transform = isMobileDevice ? 1 : 0


  return (
    <div
      ref={handRef}
      className={`relative overflow-hidden w-full ${className} h-full flex justify-center items-center`}
    >
      <svg
        id='svg-container'
        className='object-cover w-full h-full sm:w-full transition-all'
        width='5001'
        height='5000'
        style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.4s ease-in-out' }}
        viewBox='0 0 5001 5000'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='main-group' className='absolute' clip-path='url(#clip0_3369_51584)'>
          <HandPath />
          <mask
            id='mask0_3369_51584'
            style={{ maskType: 'luminance' }}
            maskUnits='userSpaceOnUse'
            x='2352'
            y='1739'
            width='535'
            height='1130'
          >
            <path
              d='M2418.73 1739.29H2820.37C2856.91 1739.29 2886.51 1768.21 2886.51 1803.9V2804.13C2886.51 2839.82 2856.91 2868.75 2820.37 2868.75H2418.73C2382.2 2868.75 2352.59 2839.82 2352.59 2804.13V1803.67C2352.59 1768.21 2382.2 1739.29 2418.73 1739.29Z'
              fill='white'
            />
          </mask>
          <g mask='url(#mask0_3369_51584)'>
            <path d='M2890.96 1750.06H2347V2855.13H2890.96V1750.06Z' fill='#141414' />
            {/* <rect x="2366.78" y="1752" width="519.896" height="1125" rx="12" fill="black" /> */}
           
              <image
                style={{
                  transition: 'all 0.1s ease-in-out',
                  backgroundColor: '#333',
                }}
                x='2352'
                y='1739'
                width='535'
                height='1130'
                rx='12'
                href={defaultImg}
              />
            <Images images={images} ind={ind} />
           
          </g>
          <path
            d='M2350.83 1816.53L2350.14 2791.66C2350.14 2835.21 2385.24 2870.74 2428.77 2870.74L2809.85 2870.97C2853.16 2870.97 2888.48 2835.67 2888.48 2791.89L2889.39 1816.76C2889.39 1773.21 2854.29 1737.68 2810.76 1737.68H2429.46C2386.15 1737.68 2351.05 1772.98 2350.83 1816.53ZM2808.71 2854.69L2429.23 2854.46C2394.59 2854.46 2366.32 2826.04 2366.32 2791.2L2367.46 1817.68C2367.46 1782.84 2395.73 1754.41 2430.37 1754.41L2809.62 1754.64C2844.27 1754.64 2872.53 1783.07 2872.53 1817.91L2871.62 2791.2C2871.62 2826.27 2843.58 2854.69 2808.71 2854.69Z'
            fill='#020202'
          />
          <path
            d='M2657.76 1737.8C2657.76 1739.64 2655.47 1741.02 2652.73 1741.02H2587.5C2584.76 1741.02 2582.47 1739.64 2582.47 1737.8H2657.76Z'
            fill='#353535'
          />
          <path
            d='M2899.64 2043.04H2900.79C2902.62 2043.04 2904.22 2044.64 2904.22 2046.47V2166.41C2904.22 2168.24 2902.62 2169.84 2900.79 2169.84H2899.64C2897.81 2169.84 2896.21 2168.24 2896.21 2166.41V2046.47C2896.21 2044.64 2897.81 2043.04 2899.64 2043.04Z'
            fill='url(#paint0_linear_3369_51584)'
          />
          <path
            d='M2902.15 2170.07H2898.26C2897.12 2170.07 2895.98 2169.15 2895.98 2167.78V2045.1C2895.98 2043.95 2896.89 2042.81 2898.26 2042.81H2902.15C2903.3 2042.81 2904.44 2043.72 2904.44 2045.1V2167.78C2904.44 2168.93 2903.53 2170.07 2902.15 2170.07ZM2898.26 2043.26C2897.35 2043.26 2896.43 2044.18 2896.43 2045.1V2167.78C2896.43 2168.7 2897.12 2169.61 2898.26 2169.61H2902.15C2903.07 2169.61 2903.98 2168.7 2903.98 2167.78V2045.1C2903.98 2044.18 2903.3 2043.26 2902.15 2043.26H2898.26Z'
            fill='url(#paint1_linear_3369_51584)'
          />
          <path
            d='M2339.21 1981.69C2336.92 1981.69 2335.32 1979.86 2335.32 1977.57V1944.16C2335.32 1941.87 2337.15 1940.27 2339.44 1940.27C2341.73 1940.27 2343.33 1942.1 2343.33 1944.39V1977.8C2343.33 1979.86 2341.5 1981.69 2339.21 1981.69Z'
            fill='url(#paint2_linear_3369_51584)'
          />
          <path
            d='M2338.52 2015.57H2339.66C2341.49 2015.57 2343.09 2017.17 2343.09 2019V2090.87C2343.09 2092.71 2341.49 2094.31 2339.66 2094.31H2338.52C2336.68 2094.31 2335.08 2092.71 2335.08 2090.87V2019C2335.08 2017.17 2336.68 2015.57 2338.52 2015.57Z'
            fill='url(#paint3_linear_3369_51584)'
          />
          <path
            d='M2341.03 2094.54H2337.14C2336 2094.54 2334.85 2093.62 2334.85 2092.25V2017.63C2334.85 2016.48 2335.77 2015.34 2337.14 2015.34H2341.03C2342.17 2015.34 2343.32 2016.26 2343.32 2017.63V2092.25C2343.32 2093.62 2342.17 2094.54 2341.03 2094.54ZM2337.14 2015.8C2336.22 2015.8 2335.31 2016.48 2335.31 2017.63V2092.25C2335.31 2093.16 2336 2094.08 2337.14 2094.08H2341.03C2341.95 2094.08 2342.86 2093.16 2342.86 2092.25V2017.63C2342.86 2016.71 2342.17 2015.8 2341.03 2015.8H2337.14Z'
            fill='url(#paint4_linear_3369_51584)'
          />
          <path
            d='M2338.52 2116.05H2339.66C2341.49 2116.05 2343.09 2117.65 2343.09 2119.48V2191.36C2343.09 2193.19 2341.49 2194.79 2339.66 2194.79H2338.52C2336.68 2194.79 2335.08 2193.19 2335.08 2191.36V2119.48C2335.08 2117.65 2336.68 2116.05 2338.52 2116.05Z'
            fill='url(#paint5_linear_3369_51584)'
          />
          <path
            d='M2341.03 2195.02H2337.14C2336 2195.02 2334.85 2194.1 2334.85 2192.73V2118.11C2334.85 2116.97 2335.77 2115.82 2337.14 2115.82H2341.03C2342.17 2115.82 2343.32 2116.74 2343.32 2118.11V2192.73C2343.09 2193.87 2342.17 2195.02 2341.03 2195.02ZM2337.14 2116.28C2336.22 2116.28 2335.31 2117.2 2335.31 2118.11V2192.73C2335.31 2193.64 2336 2194.56 2337.14 2194.56H2341.03C2341.95 2194.56 2342.86 2193.64 2342.86 2192.73V2118.11C2342.86 2117.2 2342.17 2116.28 2341.03 2116.28H2337.14Z'
            fill='url(#paint6_linear_3369_51584)'
          />
          <path
            d='M2809.24 1729.23L2430.74 1729C2380.85 1729 2340.34 1769.51 2340.34 1819.41L2339.43 2788.99C2339.43 2838.88 2379.93 2879.4 2429.82 2879.4L2808.33 2879.63C2858.22 2879.63 2898.72 2839.11 2898.72 2789.21L2899.64 1819.64C2899.64 1769.97 2859.13 1729.46 2809.24 1729.23ZM2840.37 2865.44C2830.07 2869.78 2819.31 2871.84 2808.33 2871.84L2429.82 2871.61C2418.61 2871.61 2407.85 2869.33 2397.78 2864.98C2387.94 2860.86 2379.02 2854.91 2371.47 2847.35C2363.91 2839.8 2357.96 2830.87 2353.84 2821.03C2349.5 2810.73 2347.44 2799.97 2347.44 2788.99L2348.35 1819.41C2348.35 1808.2 2350.64 1797.44 2354.76 1787.37C2358.88 1777.52 2364.83 1768.83 2372.38 1761.04C2379.93 1753.49 2388.86 1747.54 2398.7 1743.42C2409 1739.07 2419.75 1737.01 2430.74 1737.01L2809.24 1737.24C2820.46 1737.24 2831.21 1739.53 2841.28 1743.65C2851.12 1747.77 2860.05 1753.72 2867.6 1761.27C2875.15 1768.83 2881.1 1777.75 2885.22 1787.6C2889.57 1797.9 2891.63 1808.65 2891.63 1819.64L2890.71 2789.21C2890.71 2800.43 2888.42 2811.19 2884.3 2821.26C2880.18 2831.1 2874.24 2839.8 2866.68 2847.58C2859.13 2855.36 2850.21 2861.32 2840.37 2865.44Z'
            fill='#777777'
          />
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M2870.35 1758.76C2878.13 1766.77 2884.31 1775.92 2888.65 1786.22C2893 1796.98 2895.29 1808.2 2894.83 1819.87L2893.92 2789.44C2893.92 2800.89 2891.63 2812.33 2887.05 2822.86C2882.7 2833.16 2876.52 2842.32 2868.51 2850.33C2860.51 2858.11 2851.35 2864.29 2841.05 2868.64C2830.53 2872.99 2819.31 2875.28 2807.64 2875.28L2429.14 2875.05C2417.69 2875.05 2406.25 2872.76 2395.72 2868.18C2385.43 2863.83 2376.27 2857.65 2368.26 2849.64C2360.48 2841.63 2354.3 2832.47 2349.96 2822.17C2345.61 2811.65 2343.32 2800.43 2343.32 2788.76L2344.23 1819.18C2344.23 1807.74 2346.52 1796.29 2351.1 1785.76C2355.45 1775.69 2361.63 1766.31 2369.64 1758.53C2377.65 1750.52 2386.8 1744.34 2397.1 1739.99C2407.85 1735.64 2419.07 1733.35 2430.74 1733.35H2809.47C2820.92 1733.35 2832.36 1735.64 2842.88 1740.22C2853.18 1744.56 2862.34 1750.74 2870.35 1758.76ZM2887.96 2791.15C2887.96 2834.69 2852.72 2869.99 2809.24 2869.99H2429.82C2389.01 2869.99 2355.45 2838.89 2351.49 2799.06C2351.08 2795.75 2350.87 2792.39 2350.87 2788.99L2351.1 1817.11C2351.1 1773.56 2386.34 1738.27 2429.82 1738.27H2809.24C2848.39 1738.27 2880.86 1766.87 2886.94 1804.35C2887.93 1809.38 2888.42 1814.48 2888.42 1819.64L2887.96 2791.15Z'
            fill='url(#paint7_linear_3369_51584)'
          />
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M2430.74 1729L2809.24 1729.23C2859.13 1729.46 2899.64 1769.97 2899.64 1819.64L2898.72 2789.21C2898.72 2839.11 2858.22 2879.63 2808.33 2879.63L2429.82 2879.4C2379.93 2879.4 2339.43 2838.88 2339.43 2788.99L2340.34 1819.41C2340.34 1769.51 2380.85 1729 2430.74 1729ZM2808.33 2876.42C2856.16 2876.42 2895.29 2837.28 2895.29 2789.44L2896.2 1819.87C2896.2 1772.03 2857.07 1732.89 2809.24 1732.89L2430.74 1732.66C2382.91 1732.66 2343.78 1771.8 2343.78 1819.64L2342.86 2789.21C2342.86 2837.05 2381.99 2876.19 2429.82 2876.19L2808.33 2876.42Z'
            fill='url(#paint8_linear_3369_51584)'
          />
          <path
            d='M2887.96 2762.44H2898.95V2756.03H2887.96V2762.44Z'
            fill='url(#paint9_linear_3369_51584)'
          />
          <path
            d='M2453.16 2869.99V2879.63H2459.57V2869.99H2453.16Z'
            fill='url(#paint10_linear_3369_51584)'
          />
          <path
            d='M2339.43 2755.57H2350.87V2761.98H2339.43V2755.57Z'
            fill='url(#paint11_linear_3369_51584)'
          />
          <path
            d='M2780.41 1729.23H2786.82V1738.27H2780.41V1729.23Z'
            fill='url(#paint12_linear_3369_51584)'
          />
          <path
            d='M2888.2 1847.34H2899.64V1853.74H2888.2V1847.34Z'
            fill='url(#paint13_linear_3369_51584)'
          />
          <path
            d='M2351.1 1846.65H2340.33V1853.06H2351.1V1846.65Z'
            fill='url(#paint14_linear_3369_51584)'
          />
          <path
            d='M2807.19 1734.72C2818.86 1734.72 2830.3 1737.01 2840.83 1741.59C2851.12 1745.94 2860.51 1752.35 2868.29 1760.36C2876.3 1768.37 2882.48 1777.75 2886.82 1788.05C2891.4 1798.81 2893.69 1810.26 2893.69 1821.93L2892.77 2787.38C2892.77 2799.06 2890.48 2810.5 2885.91 2821.26C2881.56 2831.56 2875.15 2840.94 2867.37 2848.95C2859.59 2856.97 2850.21 2863.15 2839.91 2867.49C2829.15 2872.07 2817.94 2874.36 2806.27 2874.36L2431.88 2874.13C2420.21 2874.13 2408.77 2871.84 2398.24 2867.27C2387.94 2862.92 2378.56 2856.51 2370.78 2848.5C2362.77 2840.49 2356.59 2831.1 2352.24 2820.8C2347.67 2810.04 2345.38 2798.6 2345.38 2786.93L2346.3 1821.47C2346.3 1809.8 2348.58 1798.35 2353.16 1787.6C2357.51 1777.3 2363.92 1767.91 2371.7 1759.9C2379.48 1751.89 2388.86 1745.71 2399.16 1741.36C2409.91 1736.78 2421.13 1734.49 2432.8 1734.49L2807.19 1734.72ZM2807.19 1731.29L2432.57 1731.06C2382.91 1731.06 2342.63 1771.57 2342.63 1821.47L2341.72 2786.93C2341.72 2836.82 2381.99 2877.34 2431.65 2877.34L2806.04 2877.57C2855.7 2877.57 2895.98 2837.05 2895.98 2787.15L2896.89 1821.7C2897.12 1772.03 2856.84 1731.52 2807.19 1731.29Z'
            fill='url(#paint15_linear_3369_51584)'
          />
        </g>
        {/* <rect width="5000" height="5000" transform="translate(0.25)" fill="black" fill-opacity="0.1" /> */}
        <defs>
          <filter
            id='filter0_f_3369_51584'
            x='2420.78'
            y='1778.76'
            width='414.18'
            height='19.2598'
            filterUnits='userSpaceOnUse'
            color-interpolation-filters='sRGB'
          >
            <feFlood flood-opacity='0' result='BackgroundImageFix' />
            <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
            <feGaussianBlur stdDeviation='0.5' result='effect1_foregroundBlur_3369_51584' />
          </filter>
          <linearGradient
            id='paint0_linear_3369_51584'
            x1='2517.58'
            y1='2304.31'
            x2='2860.95'
            y2='2306.66'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint1_linear_3369_51584'
            x1='1296.37'
            y1='2352.32'
            x2='1851.16'
            y2='1228.73'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint2_linear_3369_51584'
            x1='2658.41'
            y1='2304.12'
            x2='2396.4'
            y2='2303.53'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint3_linear_3369_51584'
            x1='2667.23'
            y1='2304.54'
            x2='2403.59'
            y2='2303.42'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint4_linear_3369_51584'
            x1='1704.61'
            y1='2357.54'
            x2='2457.22'
            y2='1409'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint5_linear_3369_51584'
            x1='2660.99'
            y1='2304.54'
            x2='2397.36'
            y2='2303.42'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint6_linear_3369_51584'
            x1='2325.42'
            y1='2717.56'
            x2='2354.28'
            y2='2715.82'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint7_linear_3369_51584'
            x1='2226.46'
            y1='2409.59'
            x2='3010.94'
            y2='2192.47'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint8_linear_3369_51584'
            x1='2226.46'
            y1='2409.59'
            x2='3010.94'
            y2='2192.47'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#999999' />
            <stop offset='1' stop-color='#BBBBBB' />
          </linearGradient>
          <linearGradient
            id='paint9_linear_3369_51584'
            x1='2307.09'
            y1='2306.71'
            x2='2959.56'
            y2='2306.88'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <linearGradient
            id='paint10_linear_3369_51584'
            x1='2622.16'
            y1='1505.52'
            x2='2620.59'
            y2='2849.97'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <linearGradient
            id='paint11_linear_3369_51584'
            x1='2914.02'
            y1='2304.85'
            x2='2330.76'
            y2='2304.71'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <linearGradient
            id='paint12_linear_3369_51584'
            x1='2620.12'
            y1='3173.18'
            x2='2622.35'
            y2='1386.92'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <linearGradient
            id='paint13_linear_3369_51584'
            x1='2337.18'
            y1='2306.78'
            x2='2952.33'
            y2='2306.93'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <linearGradient
            id='paint14_linear_3369_51584'
            x1='2347.45'
            y1='1849.86'
            x2='2335.61'
            y2='1849.85'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <linearGradient
            id='paint15_linear_3369_51584'
            x1='2235.46'
            y1='2408.8'
            x2='3003.18'
            y2='2199.82'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#777777' />
            <stop offset='0.12' stop-color='#7F7F7F' />
            <stop offset='0.3' stop-color='#969696' />
            <stop offset='0.53' stop-color='#BBBBBB' />
            <stop offset='0.54' stop-color='#B8B8B8' />
            <stop offset='0.74' stop-color='#949494' />
            <stop offset='0.9' stop-color='#7F7F7F' />
            <stop offset='1' stop-color='#777777' />
          </linearGradient>
          <clipPath id='clip0_3369_51584'>
            <rect
              className='absolute bottom-0 left-0'
              width='3010.4'
              height='3271'
              fill='white'
              transform='translate(0.25 1729)'
            />
          </clipPath>
        </defs>
      </svg>
      <div
        style={{ position: 'absolute', bottom: '0%', left: '50%', zIndex: '10' }}
        ref={afterRef}
      ></div>
    </div>
  );
};

const Images = ({ images, ind }) => {
  const imgRef = useRef(null);
  return (
    <>
      {images.map((image, index) => {
        return (
          <image
            ref={imgRef}
            style={{
              display: ind === index ? 'block' : 'none',
              transition: 'all 0.1s ease-in-out',
              backgroundColor: '#333',
            }}
            x='2352'
            y='1739'
            width='535'
            height='1130'
            rx='12'
            href={`${baseMediaUrl}/${image}`}
          />
        );
      })}
    </>
  );
};

export default memo(HandAnimationPhone);
