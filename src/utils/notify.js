import toast from 'react-hot-toast';

export const showMessage = (message, size = '1rem', duration = 5000) => {
  toast.dismiss();
  toast.success(
    <div
      // style={{ fontSize: size }}
      className={getFontSizeClass(size)}
    >
      {message}
    </div>,
    {
      duration: duration,
      icon: (
        <div
          className={`showMessageIcon ${getFontSizeClass(size)}`}
          // style={{ fontSize: size }}
        >
          i
        </div>
      ),
    },
  );
};

export const showError = (message, size = '1rem', duration = 5000) => {
  toast.dismiss();
  toast.error(
    <div
      // style={{ fontSize: size }}
      className={getFontSizeClass(size)}
    >
      {message}
    </div>,
    {
      duration: duration,
      icon: (
        <div
          className={`showMessageIcon ${getFontSizeClass(size)}`}
          // style={{ fontSize: size }}
        >
          !
        </div>
      ),
    },
  );
};
