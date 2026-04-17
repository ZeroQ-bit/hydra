<div align="center">
  <img src="https://img.shields.io/badge/Hydra-Next%20Gen%20Stremio-00ffcc?style=for-the-badge&logo=appveyor" alt="Hydra Logo" />
  <h1>Hydra</h1>

  <p>
    <strong>The next-generation HTTP stream aggregator for Stremio. Rebuilt from the ground up to never fail.</strong>
  </p>

  [![Tests](https://github.com/zainulnazir/hydra/actions/workflows/tests.yml/badge.svg)](https://github.com/zainulnazir/hydra/actions/workflows/tests.yml)
  [![GitHub release](https://img.shields.io/github/v/release/zainulnazir/hydra)](https://github.com/zainulnazir/hydra/releases)
  [![Website](https://img.shields.io/badge/Website-hydra.zainulnazir.com-00ffcc)](https://zainulnazir.github.io/hydra/)

</div>

---

Hydra is a highly concurrent [Stremio](https://www.stremio.com/) add-on which aggregates HTTP streaming URLs natively. This is a significantly enhanced, high-performance, and rebranded evolution of the original webstreamer project.

Hydra introduces next-generation features including **Automated Extractor Verification**, **Intelligent Distributed Caching** via Redis, **High-Concurrency Fetching (Proxies & Retries)**, and revolutionary **AI Capabilities (Gemini & OpenAI integration)** for resilient DOM extraction and stream prioritization!

🌐 **[Visit the Official Hydra Website](https://hydra.hapticfeed.tech/)**

## 🐉 Key Features

- 🤖 **AI-Powered Fallback**: Enter your own Gemini or OpenAI API keys on the configuration page. If our native extractors fail to parse the streaming sources due to structural DOM changes, the AI agent dynamically steps in to analyze the payload and recover the stream links. It heals itself.
- ⚡ **Intelligent Distributed Caching**: Backed by Redis to drastically improve response times globally and reduce load on streaming providers.
- 🚀 **Concurrent & Resilient Architecture**: Uses smart proxying, retries, and high-concurrency requests to pull in links faster than ever.
- 🖥️ **Modern Configuration UI**: A sleek, dark-mode, glassmorphism setup page to cleanly configure your Stremio Add-On experience and visually test your API keys.
- ✅ **Automated Extractor Verification**: Constant background verification to ensure our supported streaming hosters remain operational.

## Known issues / limitations

- PixelServer / pixeldrain has a daily limit of 6 GB per IP.
- Dropload and SuperVideo on Android do not work because Stremio does not use the `Referer` header properly via HLS playlists.
- MediaFlow proxy has to be used in an inefficient way because Stremio on Android or its players cannot deal with HLS playlist with redirects.
- FlareSolverr cookies cannot be used due to TLS fingerprinting, but FlareSolverr uses a session per host to speed things up.
- VidSrc works but rate limits heavily and is therefore only queried as fallback.
- RgShows detects shared usage and blocks IPs. It therefore mainly works on private instances.

## MediaFlow Proxy

[MediaFlow Proxy](https://github.com/mhdzumair/mediaflow-proxy/) can be added when configuring the add-on to gain access to more file hosters.
It is needed because some hosters ip-lock streams, and the add-on does not run on the same device streaming the video.

The following hosters can be used only with MediaFlow Proxy:
- Fastream
- FileLions
- FileMoon
- LuluStream
- Mixdrop
- Streamtape
- VOE

## Hosting

Don't want to use the public instance? It's open-source, you can host it yourself!

### Self-Hosting (Docker)

You can run the latest Hydra via Docker:

\`\`\`shell
 docker run \
    --detach=true \
    --name hydra \
    --rm \
    --pull always \
    --publish 51546:51546 \
    --env REDIS_URL="redis://your-redis-host:6379" \
    --volume /tmp:/tmp \
    zainulnazir/hydra
\`\`\`

### Environment Configuration

#### `REDIS_URL`
Optional (but recommended). The connection string to your Redis cache server.

#### `GEMINI_API_KEY` / `OPENAI_API_KEY`
Optional. Global system AI keys for the native fallback extraction framework. Note: Users can also provide their personal API keys directly on the `/configure` setup page!

#### `CACHE_DIR`
Optional. Directory for persistent caches using SQLite files (if not using Redis). Default: OS tmp dir.

#### `FLARESOLVERR_ENDPOINT`
Optional. If domains show Cloudflare challenges, FlareSolverr can be used to work around them. E.g. `http://flaresolverr:8191`.

#### `DISABLED_EXTRACTORS` / `DISABLED_SOURCES`
Optional. Comma separated list of extractors or sources which should be disabled.

---

## 🤝 Contributing

We welcome out-of-the-box thinkers, developers, and Stremio enthusiasts to help Hydra grow! 

Whether you're fixing bugs, adding new hoster templates to the `src/extractor` library, or suggesting entirely new features, your contribution matters.

1. **Check out our [Contributing Guide](CONTRIBUTING.md)** for branching, testing, and pull-request standards.
2. If you find a bug, open an Issue using our [Issue Templates](https://github.com/zainulnazir/hydra/issues).

---

## ⚖️ License

This project is licensed under the AGPL-3.0 License. See the `LICENSE.txt` file for details.
