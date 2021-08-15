import moment from "moment";

const navigationFooter = {
  main: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutus" },
    { name: "Features", href: "/features" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacypolicy" },
  ],
};
const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer">
          {navigationFooter.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <a
                href={item.href}
                className="text-base text-white hover:text-gray-100">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-base text-white">
          &copy; {`${moment(Date.now()).format("l").slice(-4)}`} TextBox, Inc.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
