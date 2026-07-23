import {
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { useEffect, useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { MemberAvatar } from "../icons/UserIcons";

interface OtherNavbarProps {
    cartItems: CartItem[];
    onAdd: (item: CartItem) => void;
    onRemove: (item: CartItem) => void;
    onDelete: (item: CartItem) => void;
    onDeleteAll: () => void;
    setSignupOpen: (isOpen: boolean) => void;
    setLoginOpen: (isOpen: boolean) => void;
    handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void
    anchorEl: HTMLElement | null;
    handleCloseLogout: () => void;
    handleLogoutRequest: () => void;
}

interface NavItem {
    to: string;
    label: string;
    authOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/orders", label: "Orders", authOnly: true },
    { to: "/member-page", label: "My page", authOnly: true },
    { to: "/help", label: "Help" },
];

/** Brand wordmark — inline SVG, inherits currentColor from the token set. */
const Wordmark = () => (
    <svg
        className={"brand-wordmark"}
        width="208"
        height="22"
        role="img"
        aria-label="Home Decor"
    >
        <text x="1" y="17">HOME DECOR</text>
    </svg>
);

export default function OtherNavbar(props: OtherNavbarProps) {
    const {
         cartItems,
         onAdd,
         onDelete,
         onRemove,
         onDeleteAll,
         setSignupOpen,
         setLoginOpen,
         handleLogoutClick,
         anchorEl,
         handleCloseLogout,
         handleLogoutRequest,
        } = props;
    const {authMember} = useGlobals();
    const [scrolled, setScrolled] = useState(false);
    const [navOpen, setNavOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navItems = NAV_ITEMS.filter((item) => !item.authOnly || authMember);

    return (
    <div className="other-navbar">
        <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <Container className="navbar-container">
            <Stack className="menu">
                <Box className="brand">
                    <NavLink to="/" aria-label="Home Decor — home">
                        <Wordmark />
                    </NavLink>
                </Box>
                    <Stack  className="links">
                        <Stack className="nav-links">
                            {navItems.map((item) => (
                                <Box className={"hover-line"} key={item.to}>
                                    {/* the "/" link intentionally has no
                                        activeClassName — without `exact` it
                                        would match every route */}
                                    <NavLink
                                        to={item.to}
                                        activeClassName={
                                            item.to === "/" ? undefined : "underline"
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </Box>
                            ))}
                        </Stack>

                        <Basket
                            cartItems={cartItems}
                            onAdd={onAdd}
                            onRemove={onRemove}
                            onDelete={onDelete}
                            onDeleteAll={onDeleteAll}
                        />

                        {!authMember ? (
                            <Box>
                                <Button
                                 variant="contained"
                                 className="login-button"
                                 onClick={() => setLoginOpen(true)}
                                 >
                                    Login
                                </Button>
                            </Box>
                        ) : (
                            <MemberAvatar
                                className="user-avatar"
                                src={
                                    authMember?.memberImage
                                    ? `${serverApi}/${authMember?.memberImage}`
                                    : null}
                                    glyphSize={17}
                                    ariaHasPopup={true}
                                    onClick={handleLogoutClick}
                            />
                        )}

                        <IconButton
                            className={"nav-toggle"}
                            aria-label="Open navigation"
                            onClick={() => setNavOpen(true)}
                        >
                            <MenuIcon fontSize="small" />
                        </IconButton>

                        <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={Boolean(anchorEl)}
                    onClose={handleCloseLogout}
                    onClick={handleCloseLogout}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            borderRadius: '2px',
                            border: '1px solid var(--line)',
                            filter: 'drop-shadow(0px 1px 2px rgba(35,32,28,0.08))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleLogoutRequest}>
                        <ListItemIcon>
                            <Logout fontSize="small" style={{ color: 'var(--ink-muted)' }} />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                   </Menu>
                   </Stack>
            </Stack>
        </Container>
        </header>

        <Drawer
            className={"nav-drawer"}
            anchor={"right"}
            open={navOpen}
            onClose={() => setNavOpen(false)}
        >
            <Box className={"drawer-head"}>
                <Box className={"drawer-label"}>Menu</Box>
                <IconButton
                    aria-label="Close navigation"
                    onClick={() => setNavOpen(false)}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            <Box className={"drawer-links"}>
                {navItems.map((item) => (
                    <NavLink
                        to={item.to}
                        key={item.to}
                        activeClassName={
                            item.to === "/" ? undefined : "underline"
                        }
                        onClick={() => setNavOpen(false)}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </Box>
        </Drawer>
      </div>
    )
      }
