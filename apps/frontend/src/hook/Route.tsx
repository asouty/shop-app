import Profile from "../component/Profile.tsx";
import Items from "../component/Items.tsx";

enum ComponentType {
  profile = "profile",
}
export function routeDefault() {
  return routeComponent("");
}
export function routeComponent(type: string | undefined) {
  switch (type) {
    case ComponentType.profile:
      return <Profile />;
  }
  return <Items />;
}
