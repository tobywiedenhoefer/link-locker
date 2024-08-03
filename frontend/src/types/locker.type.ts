type Locker = {
  id: number;
  user_id: number;
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
