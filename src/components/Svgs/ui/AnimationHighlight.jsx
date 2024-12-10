import { Text } from 'components'
import React from 'react'

const AnimationHighlight = () => {
  return (
      <div className="px-[40px] infoTile h-fit sm:absolute sm:top-0 sm:!mt-[30px] sm:mb-[20px] sm:!w-[90%] lg:mb-[80px] mt-auto xl:h-[120px]  relative xl:w-[450px] rounded-[8px] bg-[rgba(20,20,20,0.25)] backdrop-blur-[12.5px] w-[560px] pb-[40px] xl:pt-[20px] pt-[28px]">
          <Text className="text-[36px] sm:!text-[20px] xl:text-[28px] text-data-2  font-medium text-white">
              120 minutes
          </Text>
          <Text className="text-[36px] xl:!text-[28px] sm:text-[20px] text-data-1 left-0 top-[calc(50%-36px)] absolute w-full text-center font-medium text-white">
              Traditional Airlines
          </Text>
          <Text className="text-[18px] sm:!text-[14px] xl:text-[14px] text-data-2 font-medium font-hauora text-[#BFBFBF] leading-normal">
              Amount of <span className="text-white"> time </span> you stand to <span className="text-white">lose</span> on each roundtrip when  <span className="text-white">traveling on airlines</span>
          </Text>
      </div>
  )
}

export default AnimationHighlight