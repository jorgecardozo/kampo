const Loader = ({
  width = 74,
  height = 74,
  fill = '#ff3e6c',
  type = 'spinner',
}) => {
  const loaderClasses = {
    dots: (
      <svg
        version="1.1"
        id="L4"
        x="0px"
        y="0px"
        viewBox="0 0 50 40"
        enableBackground="new 0 0 0 0"
        width={width}
        height={height}
      >
        <circle fill={fill} stroke="none" cx="6" cy="20" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle fill={fill} stroke="none" cx="26" cy="20" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle fill={fill} stroke="none" cx="46" cy="20" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
    ),
    spinner: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          r="32"
          strokeWidth="6"
          stroke={fill}
          strokeDasharray="50.26548245743669 50.26548245743669"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1.3513513513513513s"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
      </svg>
    ),
  }
  return <div className="flex justify-center">{loaderClasses[type]}</div>
}

export default Loader
