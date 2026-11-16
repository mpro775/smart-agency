import {
  FaCode,
  FaMobileAlt,
  FaPaintBrush,
  FaBullhorn,
  FaCogs,
  FaChartLine,
  FaServer,
  FaComments,
  FaLightbulb,
  FaHandshake,
  FaRocket,
} from "react-icons/fa";
import {
  FiUsers,
  FiLayers,
  FiAward,
  FiCode,
  FiGlobe,
  FiTrendingUp,
  FiSearch,
  FiPenTool,
  FiTarget,
  FiEye,
  FiDatabase,
  FiBriefcase,
  FiGrid,
  FiRepeat,
  FiMap,
  FiCheckCircle,
  FiUploadCloud,
  FiLayout,
  FiCpu,
  FiShield,
  FiStar,
} from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";

// Includes service seeds and every icon offered by the About CMS picker.
const icons = {
  FaCode,
  FaMobileAlt,
  FaPaintBrush,
  FaBullhorn,
  FaCogs,
  FaChartLine,
  FaServer,
  FaComments,
  FaLightbulb,
  FaHandshake,
  FaRocket,
  FiUsers,
  FiLayers,
  FiAward,
  FiCode,
  FiGlobe,
  FiTrendingUp,
  FiSearch,
  FiPenTool,
  FiTarget,
  FiEye,
  FiDatabase,
  FiBriefcase,
  FiGrid,
  FiRepeat,
  FiMap,
  FiCheckCircle,
  FiUploadCloud,
  FiLayout,
  FiCpu,
  FiShield,
  FiStar,
  RiTeamLine,
};

export default function CmsIcon({
  name,
  size = 24,
  className,
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  const Icon =
    name && Object.prototype.hasOwnProperty.call(icons, name)
      ? icons[name as keyof typeof icons]
      : FaCode;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
