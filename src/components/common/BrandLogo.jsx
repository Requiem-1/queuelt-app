import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export const BrandLogo = ({
  className = '',
  showText = true,
  to = '/',
  imgClassName = 'h-10',
  textSize = 'text-2xl',
  isDarkBackground = false,
}) => {
  return (
    <Link
      to={to || '/'}
      className={`flex items-center gap-2 cursor-pointer select-none no-underline shrink-0 group ${className}`}
    >
      <img
        src={logoImg}
        alt="QueueIt Logo"
        className={`${imgClassName} w-auto object-contain bg-transparent shrink-0`}
      />
      {showText && (
        <div className="flex items-center overflow-visible whitespace-nowrap">
          <span
            className={`${textSize} font-extrabold tracking-tight select-none ${
              isDarkBackground ? 'text-white' : 'text-zinc-900 dark:text-white'
            }`}
          >
            Queue
            <span
              className={`font-semibold ${
                isDarkBackground ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              It
            </span>
          </span>
        </div>
      )}
    </Link>
  );
};

export default BrandLogo;
