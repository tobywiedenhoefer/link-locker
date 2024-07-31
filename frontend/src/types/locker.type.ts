type Locker = {
  id: string;
  uid: string | null;
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
