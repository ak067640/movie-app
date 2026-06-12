import { Play } from "lucide-react";
const Logo = () => {
  return (
    <div className="logo-wrapper">
      <div className="name flex items-center text-2xl">
        <Play size={25} className="text-red-400" />
        <h1>Cine</h1>
        <h1 className="text-red-400">Hub</h1>
      </div>
    </div>
  );
};

export default Logo;
