import Logout from "@/auth/Logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

import { Bolt, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { EditProfile } from "../main/EditProfile";
import { EditPassword } from "../main/EditPassword";

export default function DropDown() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPasswordOpen, setEditPasswordOpen] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(`${API_URL}/api/student/me`, {
        withCredentials: true,
      });
      if (res.status !== 200) {
        return;
      }
      setUserData({
        name: res.data.name,
        email: res.data.email,
      });
    };
    fetchUserData();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-start flex flex-col">
          <p className="text-sm font-medium">{userData.name}</p>
          <p className="text-xs text-muted-foreground">{userData.email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-72">
        <DropdownMenuItem className="py-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-1 flex flex-col">
            <p className="text-sm font-medium">{userData.name}</p>
            <p className="text-xs text-muted-foreground">{userData.email}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditProfileOpen(true);
            }}
            className="cursor-pointer"
          >
            <User className="mr-1" />
            Edit profile
          </DropdownMenuItem>

          <EditProfile
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
          />
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditPasswordOpen(true);
            }}
            className="cursor-pointer"
          >
            <Bolt className="mr-1" />
            Change password
          </DropdownMenuItem>
          <EditPassword
            open={editPasswordOpen}
            onOpenChange={setEditPasswordOpen}
          />
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
          <LogOut className="mr-1" />
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
