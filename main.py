from flask import Flask, request, jsonify
import ffmpeg
import subprocess
import io

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return "WAGMI!"


@app.route("/", methods=["POST"])
def stitch():
    # URL of the audio file and path to your local video file
    audio_url = "https://piuhxhbwhkzyrufyjqsy.supabase.co/storage/v1/object/public/new/audio/audio-100qFB5.mp3"
    video_file_path = "./video.mp4"

    # Construct the FFmpeg command
    input_video = ffmpeg.input(video_file_path)
    input_audio = ffmpeg.input(audio_url)
    ffmpeg_command = (
        ffmpeg.concat(input_video, input_audio, v=1, a=1)
        .output("pipe:", format="mp4", vcodec="libx264", acodec="aac")
        .compile()
    )

    # Run the FFmpeg command and capture the output in a buffer
    process = subprocess.Popen(
        ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    output, err = process.communicate()

    # The output variable now contains the video file data
    output_buffer = io.BytesIO(output)
    print(output_buffer, "---output_buffer")

    return output_buffer


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)
