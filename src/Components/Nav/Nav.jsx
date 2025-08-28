import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,

} from "@heroui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext,  useState } from "react";
import { useLocation } from "react-router-dom";

import { AuthContext } from "../../Context/AuthContext";
//assets
import logo from "./../../assets/logo.png";

import { LoaderIcon } from "react-hot-toast";
// heroui
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@heroui/react";
import useGet from "../../Hooks/useGet";

export default function Nav() {

  const { userToken, setUserToken } = useContext(AuthContext);
const location = useLocation();
const pathname = location.pathname.toLowerCase()

  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    setUserToken("");
    navigate("/login");
  }
const {data,error,Loader}=useGet("get","https://linked-posts.routemisr.com/users/profile-data",null,{token:userToken})



  return (
    <Navbar className="bg-transparent w-full text-white p-2 px-2 ">
      <div className="">
        <NavbarBrand>
          <img className="w-40 m-5" src={logo} alt="logo" />
          
        </NavbarBrand>
      </div>
      <div className="flex justify-between ">
        {userToken && (
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <NavLink color="foreground" to="/posts">
                Home
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
              <NavLink aria-current="page" to="/profile">
                Profile
              </NavLink>
            </NavbarItem>
         
          </NavbarContent>
        )}
      </div>
      <div>
        {!userToken ? (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
          {(pathname === "/register" || pathname === "/") && (
  <Button as={NavLink} className=" LOGIN bg-glass text-white" to="/login" variant="flat">
    Login
  </Button>
)}
            </NavbarItem>
            <NavbarItem>
          {pathname === "/login"&&

              <Button
                as={NavLink}
                className=" REGISTER bg-glass text-white" 

                to="/register"
                variant="flat"
              >
                Register
              </Button>}
            </NavbarItem>
          </NavbarContent>
        ) : (
          <>
          {data?.user?
            <div className="flex items-center gap-4">
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: data?.user.photo,
                    }}
                    className="transition-transform"
                    description={data?.user.email}
                    name={data?.user.name}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile" as={NavLink} to="/profile" className="h-14 gap-2">

                 Profile

                  </DropdownItem>

            
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                    as={NavLink}
                    to="/Login"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>:<LoaderIcon/>}
          </>
        )}
      </div>
    </Navbar>
  );
}
