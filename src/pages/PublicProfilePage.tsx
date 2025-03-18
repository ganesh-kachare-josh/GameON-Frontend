import Profile from "@/components/profile/Profile"
import { useParams } from "react-router"

function PublicProfilePage() {
    const { userId } = useParams();
    return (
        <main>
            <Profile userId={userId} />
        </main>
    )
}

export default PublicProfilePage