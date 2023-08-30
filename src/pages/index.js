import Home from "./Home";
import Explore from "./Explore";
import ItemsCategory from "./ItemsCategory";
import LiveAuctions from "./LiveAuctions";
import ItemDetails from "./ItemDetails";
import Blog from "./Blog";
import BlogDetails from "./BlogDetails";
import HelpCenter from "./HelpCenter";
import Author from "./Author";
import CollectionList from "./CollectionLists";
import CollectionItems from "./CollectionItems";
import WalletConnect from "./WalletConnect";
import CreateItem from "./CreateItem";
import EditProfile from "./EditProfile";
import Ranking from "./Ranking";
import Login from "./Login";
import SignUp from "./SignUp";
import NoResult from "./NoResult";
import FAQ from "./FAQ";
import Contact from "./Contact";

const routes = [
  { path: "/", component: <Home /> },
  { path: "/explore", component: <Explore /> },
  { path: "/ItemsCategory/:category", component: <ItemsCategory /> },
  { path: "/live-auctions", component: <LiveAuctions /> },
  { path: "/item-details/:itemId", component: <ItemDetails /> },
  { path: "/collectionList", component: <CollectionList /> },
  { path: "/collectionItems/:collectionId", component: <CollectionItems /> },
  { path: "/blog", component: <Blog /> },
  { path: "/blog-details", component: <BlogDetails /> },
  { path: "/help-center", component: <HelpCenter /> },
  { path: "/author/:userId", component: <Author /> },
  { path: "/wallet-connect", component: <WalletConnect /> },
  { path: "/create-item", component: <CreateItem /> },
  { path: "/edit-profile", component: <EditProfile /> },
  { path: "/ranking", component: <Ranking /> },
  { path: "/login", component: <Login /> },
  { path: "/sign-up", component: <SignUp /> },
  { path: "/no-result", component: <NoResult /> },
  { path: "/faq", component: <FAQ /> },
  { path: "/contact", component: <Contact /> },
];

export default routes;
