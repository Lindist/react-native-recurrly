import { useState, useEffect } from "react";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

let subscriptions = [...HOME_SUBSCRIPTIONS];
type Listener = (subscriptions: typeof HOME_SUBSCRIPTIONS) => void;
const listeners = new Set<Listener>();

export const store = {
  getSubscriptions: () => subscriptions,
  addSubscription: (newSub: any) => {
    subscriptions = [newSub, ...subscriptions];
    listeners.forEach((l) => l(subscriptions));
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }
};

export function useSubscriptions() {
  const [data, setData] = useState(store.getSubscriptions());
  useEffect(() => {
    return store.subscribe(setData);
  }, []);
  return data;
}
