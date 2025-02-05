import { memo, useEffect, useState } from "react";
import WormholeConnect, {
  nttRoutes,
  WormholeConnectConfig,
} from "@wormhole-foundation/wormhole-connect";
import { useConnectConfig } from "../../hooks/useConnectConfig";
import { styled } from "@mui/material";
import { NAVBAR_WIDTH } from "./NavBar";
import { theme } from "../../theme/connect";
import { Banner } from "./Banner";
import { fetchTokensConfig } from "../../utils/fetchTokens";

export const Container = styled("div")(({ theme }) => ({
  paddingRight: `${NAVBAR_WIDTH}px`,
  [theme.breakpoints.down("md")]: {
    paddingRight: 0,
  },
}));

export const Connect = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<WormholeConnectConfig | null>(null);

  const offlineConfig = useConnectConfig();

  useEffect(() => {
    console.log("offline", offlineConfig);

    if (offlineConfig) {
      const asyncConfig = async () => {
        const { nttTokensConfig, tokensConfig, wrappedTokensConfig } =
          await fetchTokensConfig("Mainnet");

        const nttRoutesConfig = nttTokensConfig
          ? nttRoutes({ tokens: nttTokensConfig })
          : [];

        const allTokensConfig: any = {};
        if (wrappedTokensConfig) {
          allTokensConfig.wrappedTokens = wrappedTokensConfig;
        }
        if (tokensConfig) {
          allTokensConfig.tokensConfig = tokensConfig;
        }

        const fullConfig = {
          ...offlineConfig,
          routes: [...(offlineConfig.routes || []), ...nttRoutesConfig],
          ...allTokensConfig,
        };

        setConfig(fullConfig);
        console.log("fullConfig", fullConfig);

        localStorage.setItem(
          `${window.location.href}?${import.meta.env.VITE_APP_VERSION}`,
          JSON.stringify(fullConfig, null, 2)
        );

        setIsLoading(false);
      };

      asyncConfig();
    }
  }, [offlineConfig]);

  return (
    <Container>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!!config && <WormholeConnect config={config} theme={theme} />}
          <Banner />
        </>
      )}
    </Container>
  );
});
