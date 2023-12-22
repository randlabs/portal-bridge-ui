import NewBarButton from "./NewsBarButton";
import useBannerMessageConfig, {
  useMessages,
  type Message,
} from "../../hooks/useBannerMessage";
import Bar from "./Bar";

export type NewsBarProps = {
  messages: Message[];
};

export default function NewsBar({ messages }: NewsBarProps) {
  const message = useBannerMessageConfig(messages);
  const banners = useMessages();
  return (
    <>
      {message && (
        <Bar background={message.background}>
          <>
            {message.content}
            {message.button ? <NewBarButton button={message.button} /> : null}
          </>
        </Bar>
      )}
      {banners &&
        banners.map((banner) => (
          <Bar background={banner.background}>
            <div dangerouslySetInnerHTML={{ __html: banner.content }} />
          </Bar>
        ))}
    </>
  );
}
