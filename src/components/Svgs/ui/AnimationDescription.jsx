import { Img, Text } from 'components'
import React from 'react'

const AnimationDescription = () => {
  return ( 
      <div className="h-full infoTileTop px-[40px] lg:px-[10px] py-[20px] lg:py-[10px] sm:!w-[90%] rounded-[8px] bg-[rgba(20,20,20,0.25)] backdrop-blur-[12.5px] xl:w-[450px] lg:w-[358px] w-[560px] ">
          <div className="flex justify-center w-full" >
              <Img className={"xl:max-w-[150px]"} src={"/images/backgroundmap/BlackJetWordmark.svg"} />
          </div>
          <div className="text-white my-[28px]">
              <Text className="text-[32px] xl:text-[24px] font-semibold font-hauoraSemiBold">Launch Route</Text>
              <Text className="text-[28px] xl:text-[20px] font-semibold font-hauoraSemiBold">Fall 2024</Text>
          </div>
          <div className="font-hauoraBold text-white-A700 text-[18px] mb-[24px]">
              <Text>Do you value your time and convenience?</Text>
          </div>
          <div className="font-hauora text-white-A700 text-[16px] sm:!leading-none leading-normal mb-[28px]">
              <span className="text-[#BFBFBF]">Book your flight in seconds and </span> arrive 15 minutes before departure. In <span className="text-[#BFBFBF]">and</span> out <span className="text-[#BFBFBF]">of the</span> airport in minutes, not hours. <br /> <br className="sm:hidden" /> <span className="text-[#BFBFBF]">Fly from</span> private terminals. No security lines, <span className="text-[#BFBFBF]">no drawn out boarding procedures, and no loudspeakers.</span>
          </div>
          <div>
              <Text className="text-[24px] md:text-[20px] font-hauora text-white ">
                  Weekly Routine Flights
              </Text>
              <div className="flex sm:items-start mt-[16px] sm:flex-col items-center gap-2" >
                  <Text className="font-medium border border-[#fff] rounded-[4px] p-[8px] text-white md:text-[14px] xl:text-[14px] text-[18px]">
                      Sydney - Bankstown
                  </Text>
                  <Img className={"py-[8px]"} src={"/images/backgroundmap/ArrowBidirectionalLeftRight.svg"} alt="ArrowBidirectionalLeftRight" />
                  <Text className="font-medium border border-[#fff] rounded-[4px] p-[8px] text-white md:text-[14px] xl:text-[14px] text-[18px]">
                      Sydney - Bankstown
                  </Text>
              </div>
          </div>
      </div>
  )
}

export default AnimationDescription