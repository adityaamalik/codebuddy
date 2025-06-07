import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "react-hot-toast";

const useMeetingActions = () => {
    const router = useRouter();
    const client = useStreamVideoClient();

    const createInstantMeeting = async () => {
        if (!client) {
            throw new Error("Stream video client not found");
        }

        try {
            const id = crypto.randomUUID();
            const call = client.call("default", id);

            await call.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                    custom: {
                        description: "Instant Meeting",
                    }
                },
            });

            router.push(`/meeting/${call.id}`);
            toast.success("Meeting created successfully");
        } catch (error) {
            toast.error("Failed to create meeting");
        }
    };

    const joinMeeting = async (callId: string) => {
        if (!client) {
            throw new Error("Stream video client not found");
            toast.error("Failed to join meeting");
            return;
        }

        try {
            const call = client.call("default", callId);
            await call.join();
            router.push(`/meeting/${callId}`);
            toast.success("Joined meeting successfully");
        } catch (error) {
            toast.error("Failed to join meeting");
        }
    };

    return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;