export const navItems = [
    {
        name: 'Dashboard',
        icon: '/assets/icons/dashboard.svg',
        url: '/'
    },
    {
        name: 'Documents',
        icon: '/assets/icons/documents.svg',
        url: '/documents'
    },
    {
        name: 'Images',
        icon: '/assets/icons/images.svg',
        url: '/images'
    },
    {
        name: 'Media',
        icon: '/assets/icons/video.svg',
        url: '/media'
    },
    {
        name: 'Others',
        icon: '/assets/icons/others.svg',
        url: '/others'
    }
];

export const actionDropdownItems = [
    { label: 'Rename', value: 'rename', icon: '/assets/icons/edit.svg' },
    { label: 'Details', value: 'details', icon: '/assets/icons/info.svg' },
    { label: 'Share', value: 'share', icon: '/assets/icons/share.svg' },
    { label: 'Download', value: 'download', icon: '/assets/icons/download.svg' },
    { label: 'Delete', value: 'delete', icon: '/assets/icons/delete.svg' },
];

export const PLACEHOLDER_IMAGE =
    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png';
export const MAX_FILE_SIZE = 50000000;

export const sortTypes = [
    {
      label: "Date created (newest)",
      value: "$createdAt-desc",
    },
    {
      label: "Created Date (oldest)",
      value: "$createdAt-asc",
    },
    {
      label: "Name (A-Z)",
      value: "name-asc",
    },
    {
      label: "Name (Z-A)",
      value: "name-desc",
    },
    {
      label: "Size (Highest)",
      value: "size-desc",
    },
    {
      label: "Size (Lowest)",
      value: "size-asc",
    },
  ];