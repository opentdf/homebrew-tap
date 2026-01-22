class Otdfctl < Formula
  desc "CLI for managing the OpenTDF Platform"
  homepage "https://github.com/opentdf/otdfctl"
  version "0.28.0"
  license "BSD-3-Clause-Clear"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/opentdf/otdfctl/releases/download/v0.28.0/otdfctl-0.28.0-darwin-arm64.tar.gz"
      sha256 "fc90fedb9dd4f643b7e48083ee5e35fc4633da21ca8d096f95b150105dfed103"
    else
      url "https://github.com/opentdf/otdfctl/releases/download/v0.28.0/otdfctl-0.28.0-darwin-amd64.tar.gz"
      sha256 "97861084b3c6dc6a9796b4c725f3a66cbc38ef7642029bde702ff0300d3c0f54"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      if Hardware::CPU.is_64_bit?
        url "https://github.com/opentdf/otdfctl/releases/download/v0.28.0/otdfctl-0.28.0-linux-arm64.tar.gz"
        sha256 "6e00ed2b9e842f7ead28526b1053ac6c6a64a46e4ebfdf6807d97bace272edd7"
      else
        url "https://github.com/opentdf/otdfctl/releases/download/v0.28.0/otdfctl-0.28.0-linux-arm.tar.gz"
        sha256 "f8511e08814f89b2794cde848d52d633cb982a8108be1baedb31dcb6e91c72c0"
      end
    else
      url "https://github.com/opentdf/otdfctl/releases/download/v0.28.0/otdfctl-0.28.0-linux-amd64.tar.gz"
      sha256 "0c6fc0a6c944c267730e3eca720e40bfdad77fb1de18bf11eaaed5a90ea547ef"
    end
  end

  def install
    # Determine platform suffix matching release naming
    os = OS.mac? ? "darwin" : "linux"
    arch = if Hardware::CPU.arm?
      Hardware::CPU.is_64_bit? ? "arm64" : "arm"
    else
      "amd64"
    end

    # Binary is in target/ directory with version and platform suffix
    bin.install "target/otdfctl-#{version}-#{os}-#{arch}" => "otdfctl"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/otdfctl version")
  end
end
