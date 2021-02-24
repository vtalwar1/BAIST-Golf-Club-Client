export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Reservations',
    icon: 'event',
    items: [
      {
        text: 'New Reservation ',
        path: '/create-reservation',
        icon: 'add'
      },
      {
        text: 'Reservation List',
        path: '/tasks',
        icon: 'bulletlist'
      }
    ]
  }
];
