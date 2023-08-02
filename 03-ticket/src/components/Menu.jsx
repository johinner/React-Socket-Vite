import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { Menu } from "antd";
import { Link } from "react-router-dom";

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };         
}

const items = [
  getItem(<Link to="/ingresar">Ingresar</Link>,    "1", <UserOutlined />),
  getItem(<Link to="/cola">Cola de tickets</Link>, "2", <VideoCameraOutlined />),
  getItem(<Link to="/crear">Crear tickets</Link>,  "3", <UploadOutlined />),
];

export const MenuAntd = () => {
  return (
    <>
      <Menu
        /* style={{
          width: 200,
        }} */
        defaultSelectedKeys={["1"]} 
        /* defaultOpenKeys={["sub1"]} */
        mode="inline"
        theme="dark"
        items={items}
      />
    </>
  );
};
