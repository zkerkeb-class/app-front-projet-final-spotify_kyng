import Link from 'next/link';

const NavItem = ({ url, isActive, icon, name }) => {
    return (
      <Link
        href={url}
        className={` flex items-center cursor-pointer no-underline group p-3 gap-3  hover:text-white ${isActive ? 'text-white' : 'text-zinc-400'}`}
      >
        <div className="w-6 h-6 flex justify-center items-center">{icon}</div>
        <p className="text-base m-0">{name}</p>
      </Link>
    );
  };

export default NavItem;