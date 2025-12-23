import { useEffect, useRef } from "react";
import socket from "../socket";

export default function VideoPlayer({ videoId, roomId, isHost }) {
  const ref = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    const create = () => {
      if (player.current) {
        player.current.loadVideoById(videoId);
        return;
      }

      player.current = new window.YT.Player(ref.current, {
        videoId,
        events: {
          onStateChange: e => {
            if (!isHost) return;
            const t = player.current.getCurrentTime();
            if (e.data === 1) socket.emit("play-video", { roomId, currentTime: t });
            if (e.data === 2) socket.emit("pause-video", { roomId, currentTime: t });
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = create;
      document.body.appendChild(tag);
    } else create();
  }, [videoId]);

  useEffect(() => {
    socket.on("play-video", t => {
      player.current?.seekTo(t);
      player.current?.playVideo();
    });
    socket.on("pause-video", t => {
      player.current?.seekTo(t);
      player.current?.pauseVideo();
    });

    return () => {
      socket.off("play-video");
      socket.off("pause-video");
    };
  }, []);

  return <div ref={ref} style={{ borderRadius: 12, overflow: "hidden" }} />;
}
