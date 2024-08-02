type Locker = {
  id: number;
  uid: number;
  name: string;
} & (StandardLocker | LockedLocker);

type StandardLocker = {
  locked: false;
};

type LockedLocker = {
  locked: true;
  combination: string;
};

export default Locker;
