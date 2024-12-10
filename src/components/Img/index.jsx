import React from "react";

const Img = ({
  className,
  src = "defaultNoData.png",
  alt = "testImg",
  srcSet = [],
  pictureClass="",
  
  ...restProps
}) => {
  const srcValue = [...srcSet, {src}]
  return (
    <picture className={pictureClass}>
      {
        srcValue?.map((items, index) => {
          return <source {...items} key={index} />
        })
      }
      <img
        className={className}
        src={src}
        alt={alt}
        {...restProps}
        loading={"lazy"}
      />
    </picture>

  );
};
export { Img };
