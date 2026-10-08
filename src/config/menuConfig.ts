import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import CreateIcon from '@mui/icons-material/Create';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import FactoryIcon from '@mui/icons-material/Factory';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import ImportContactsSharpIcon from '@mui/icons-material/ImportContactsSharp';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import type { SvgIconComponent } from '@mui/icons-material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export interface MenuItem {
  label: string;
  path?: string; // present if it's directly clickable (no submenu, or a submenu leaf)
  icon?: SvgIconComponent;
  children?: MenuItem[];
  requiredRoles?: string[]; // optional — restrict visibility by role later
}

export const menuConfig: MenuItem[] = [
  // {
  //   label: 'Dashboard',
  //   path: '/dashboard',
  //   // icon: DashboardIcon,
  // },
 
  {
    label: 'Enquiry',
    // icon: LocalShippingIcon,
    children: [
      { label: 'Enquiry Create', path: '/Enquiry/Create' , icon: CreateIcon},
      { label: 'Enquiry Followup', path: '/Enquiry/list' , icon: CircleNotificationsIcon},
      { label: 'Adhoc Enquiry', path: '/Enquiry/Create' , icon: AddToQueueIcon},
    ],
  },
  {
    label: 'Quotation',
    // icon: LocalShippingIcon,
    children: [
      { label: 'Quotation List', path: '/quotation/list' , icon: LocalShippingIcon},
    ],
  },
  {
    label: 'Stocks',
    // icon: WarehouseIcon,
    children: [
      { label: 'Stock List', path: '/stocks/stock-list' , icon: WarehouseIcon},
      { label: 'Stock FollowUp', path: '/stocks/followup' , icon: AddAlarmIcon},
      { label: 'Stock History', path: '/stocks/history' , icon: HistoryIcon},
      { label: 'Stock Create', path: '/stocks/create' , icon: InventoryIcon},
    ],
  },
  {
    label: 'Manifest',
    // icon: LocalShippingIcon,
    children: [
      { label: 'Manifest List', path: '/manifest/list' , icon: LocalShippingIcon},
      { label: 'Manifest Create', path: '/manifest/Create' , icon: AddCircleIcon},
    ],
  },
  {
    label: 'Fliq Jobs',
    // icon: NotificationsActiveIcon,
    children: [
      { label: 'All Stages', path: '/prealerts/all-stages' , icon: NotificationsActiveIcon},
      { label: 'Stage 1', path: '/prealerts/stage-1' , icon: LooksOneIcon},
      { label: 'Stage 2', path: '/prealerts/stage-2' , icon: LooksTwoIcon},
      { label: 'Stage 3', path: '/prealerts/stage-3' , icon: Looks3Icon},
      { label: 'Stage 4', path: '/prealerts/stage-4' , icon: Looks4Icon},
    ],
  },
  {
    label: 'Finance',
    // icon: AccountBalanceIcon,
    children: [
      { label: 'Sale Invoices', path: '/finance/sale-invoices' , icon: AccountBalanceIcon},
      { label: 'Vendor Invoices', path: '/finance/vendor-invoices' , icon: AccountBalanceIcon},
      { label: 'Proforma Invoices', path: '/finance/proforma-invoices' , icon: AccountBalanceIcon},
      { label: 'Client Receipts', path: '/finance/client-receipts' , icon: AccountBalanceIcon},
      { label: 'Vendor Receipts', path: '/finance/vendor-receipts' , icon: AccountBalanceIcon},
      { label: 'Proforma Receipts', path: '/finance/proforma-receipts' , icon: AccountBalanceIcon},
      { label: 'AP Updates', path: '/finance/ap-updates' , icon: AccountBalanceIcon},
      { label: 'Non-AP Expenses', path: '/finance/non-ap-expenses' , icon: AccountBalanceIcon},
    ],
  },
  {
    label: 'Report',
    // icon: ImportContactsSharpIcon,
    children: [
      { label: 'AR Report', path: '/finance/ar-report' , icon: ImportContactsSharpIcon},
      { label: 'AP Report', path: '/finance/ap-report' , icon: ImportContactsSharpIcon},
      { label: 'P&L', path: '/finance/pl-report' , icon: ImportContactsSharpIcon},
      { label: 'Client Summary', path: '/finance/client-summary' , icon: ImportContactsSharpIcon},
    ],
  },
  {
    label: 'Ops Master',
    // icon: Inventory2Icon,
    children: [
      { label: 'Hub', path: '/master/hubs' , icon: LocalShippingIcon},
      { label: 'Contact Lists', path: '/master/contact-lists' , icon: GroupsIcon},
      { label: 'Client', path: '/master/clients' , icon: AttachMoneyIcon},
      { label: 'Vessel', path: '/master/vessels' , icon: AttachMoneyIcon},
      { label: 'Hub Locations', path: '/master/hub-locations' , icon: AttachMoneyIcon},
    ],
  },
  {
    label: 'Finance Master',
    // icon: Inventory2Icon,
    children: [
      { label: 'Currency', path: '/master/currencies' , icon: GroupsIcon},
      { label: 'Vendors', path: '/master/vendors' , icon: LocalShippingIcon},
      { label: 'Banks', path: '/master/banks' , icon: AttachMoneyIcon},
      { label: 'GL Code Parent', path: '/master/gl_code_parents' , icon: AttachMoneyIcon},
      { label: 'GL Code Child', path: '/master/gl_code_children' , icon: AttachMoneyIcon},
      { label: 'GL Code Sub Child', path: '/master/gl_code_sub_children' , icon: AttachMoneyIcon},
    ],
  },
  {
    label: 'Master',
    // icon: Inventory2Icon,
    children: [
      { label: 'Users', path: '/master/users' , icon: PeopleIcon},
      { label: 'Cargo', path: '/master/cargos' , icon: FactoryIcon},
      { label: 'Airport Codes', path: '/master/airport-codes' , icon: LocalAirportIcon},
      { label: 'Tariff Master', path: '/master/tariff-masters' , icon: Inventory2Icon},
    ],
  },
];