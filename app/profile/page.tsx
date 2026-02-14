import { getClass } from '@/services/ApiServices';
import { getLoginTo } from '../login/login';
import ListBoxComponent from '../_Components/Others/ListBoxComponent';

export default async function Profile() {
  const token = await getLoginTo();
  const user = await getClass.userProfile(token);

  return (
    <div className="container mx-auto my-5">
      <h1>Profile</h1>
      <h3 className="my-3">
        Hi! <span className="text-red-500">{user?.username}</span>, welcome to our community of pyramids.
      </h3>
      <div className="">
        <ListBoxComponent />
      </div>
    </div>
  );
}
