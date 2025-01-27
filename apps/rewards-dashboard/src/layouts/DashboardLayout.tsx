import Taurus from "../quarks/Taurus";
import { WalletManager } from "../quarks/WalletManager";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  EstimatedRewardsGraphic,
  RewardHistoryGraphic,
  TotalBridgedGraphic,
} from "../quarks/DashboardVectors";
import { InfoStatWindow, StatWindow } from "../quarks/StatWindow";
import { PortalLogo } from "../quarks/LogoVectors";
import { Trans, t } from "@lingui/macro";
import { useQuery } from "@tanstack/react-query";
import { getWACUrl } from "../constants";
import { useAppKitAccount } from "@reown/appkit/react";

interface DashboardQueryResult {
  user: string;
  usds_balance: number;
  eff_usds_balance: number;
  bridged_usds: number;
  effective_bridged_usds: number;
  net_usds_supply_in_kamino: number;
  effective_usds_balance: number;
  hourly_rewards_per_unit: number;
  accrued_rewards: number;
}

export interface OverviewQueryResult {
  usds_balance_total: number;
  usds_flagged_addresses: number;
  usds_total_supply: number;
  bridged_usds_total: number;
  effective_bridged_usds_total: number;
  net_usds_supply_in_kamino_total: number;
  effective_usds_balance_total: number;
  hourly_rewards_per_unit: number;
  accrued_rewards_total: number;
}

const ConnectedDashboard = () => {
  const { address } = useAppKitAccount();
  const [numbersHidden, setNumbersHidden] = useState(false);

  const [totalBridged, setTotalBridged] = useState<number | undefined>(
    undefined
  );
  const [historyRewardsEarned, setHistoryRewardsEarned] = useState<
    number | undefined
  >(undefined);

  const [totalUSDSBridged, setTotalUSDSBridged] = useState<number | undefined>(
    undefined
  );
  const [USDSBalance, setUSDSBalance] = useState<number | undefined>(undefined);

  const [kaminoHeld, setKaminoHeld] = useState<number | undefined>(undefined);
  const [accruedRewards, setAccruedRewards] = useState<number | undefined>(
    undefined
  );
  const { data: overview } = useQuery<OverviewQueryResult>({
    queryKey: ["overview"],
    staleTime: 5000,
    queryFn: () => {
      return fetch(`${getWACUrl("overview")}`).then((res) => {
        return res.json();
      });
    },
  });
  const { data: userInfo } = useQuery<DashboardQueryResult>({
    queryKey: [address],
    enabled: !!address,
    staleTime: 5000,
    queryFn: () => {
      return fetch(`${getWACUrl("usersummary")}?address=${address}`).then(
        (res) => {
          return res.json();
        }
      );
    },
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    setTotalUSDSBridged(userInfo.bridged_usds); // TODO: Change to effective_bridged_usds after going live
    setUSDSBalance(userInfo.effective_usds_balance);
    setKaminoHeld(userInfo.net_usds_supply_in_kamino);
    setAccruedRewards(userInfo.accrued_rewards);
  }, [userInfo]);
  useEffect(() => {
    if (!overview) {
      return;
    }
    setTotalBridged(overview.bridged_usds_total);
    setHistoryRewardsEarned(overview.accrued_rewards_total);
  }, [overview]);

  const maybeHide = (x?: number) => {
    if (numbersHidden == true) {
      return undefined;
    }
    return x;
  };

  const formatInteger = (x?: number, decimals: number = 2) => {
    x = maybeHide(x);
    return x !== undefined
      ? x === 0
        ? "0"
        : x.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: x < 1 ? decimals : 2,
          })
      : undefined;
  };

  return (
    <div className="grow flex flex-col justify-center items-center">
      <div
        className="
        flex flex-col justify-center items-center
        pb-16
        "
      >
        <h1
          className="
          text-white
          text-4xl
          md:text-5xl
          "
        >
          <Trans>Connected Dashboard Title</Trans>
        </h1>
        <h2
          className="
          text-white
          md:text-md
          pt-5
          pb-4
          md:pb-8
          "
        >
          <Trans>
            100,000 USDS in{" "}
            <a
              href="https://x.com/SkyEcosystem/status/1858873709722734611"
              className="text-blue-500"
              target="_blank"
            >
              Weekly Rewards
            </a>{" "}
            for users going from Ethereum to Solana!
          </Trans>
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-screen-xl">
        <div
          className="flex flex-col items-start gap-4
          bg-[#44457D] bg-opacity-30 backdrop-blur-lg
          rounded-lg
          px-11 pt-12 pb-12
          grow
          "
        >
          <div className="flex flex-col sm:flex-row md:items-center w-full text-start justify-between gap-4">
            <h3 className="whitespace-pre text-white text-4xl">
              <Trans>Connected Dashboard Header </Trans>
            </h3>
            <div
              className="flex flex-row items-center hover:cursor-pointer"
              onClick={() => {
                setNumbersHidden(!numbersHidden);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="12"
                fill="none"
                viewBox="0 0 18 12"
              >
                <path
                  fill="#fff"
                  d="M15.938 8.2L14.63 6.63l.213-.184c1.455-1.262 2.463-2.931 2.994-4.967a.866.866 0 00-.62-1.055.863.863 0 00-1.054.62c-1.53 5.86-6.993 5.978-7.224 5.981-.236 0-5.71-.118-7.238-5.982a.865.865 0 00-1.674.436c.53 2.034 1.539 3.705 2.994 4.967l.213.184L1.926 8.2a.863.863 0 00.11 1.216.892.892 0 001.218-.11L4.68 7.599l.205.107a9.754 9.754 0 002.937.96l.245.036v2.36c0 .476.39.865.864.865.475 0 .865-.39.865-.864v-2.36l.245-.038a9.795 9.795 0 002.937-.959l.204-.107 1.427 1.709a.889.889 0 001.219.109.862.862 0 00.109-1.216z"
                ></path>
              </svg>
              <div className="whitespace-pre text-white text-md pl-2">
                {numbersHidden ? t`Hide Number Text` : t`Show Number Text`}
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <WalletManager />
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <InfoStatWindow
                  header={t`Bridged Header`}
                  value={formatInteger(totalUSDSBridged, 6)}
                  unit="USDS"
                  infoElement={<Trans>Bridged Window Tooltip</Trans>}
                />
                <InfoStatWindow
                  header={t`USDS Held Header`}
                  value={formatInteger(USDSBalance, 6)}
                  unit="USDS"
                  infoElement={<Trans>USDS Held Window Tooltip</Trans>}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <InfoStatWindow
                  header={t`Kamino USDS Held Value Header`}
                  value={formatInteger(kaminoHeld, 6)}
                  unit="Kamino USDS"
                  infoElement={<Trans>Kamino USDS Held Value Tooltip</Trans>}
                />
              </div>
              <div className="">
                <InfoStatWindow
                  header={t`Accrued Rewards Header`}
                  value={formatInteger(accruedRewards, 6)}
                  unit="USDS"
                  infoElement={<Trans>Accrued Rewards Tooltip</Trans>}
                  subtext={t`Rewards will be distributed directly to your wallet on a weekly basis.`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <StatWindow
            header={t`Staking Power Header`}
            value={formatInteger(totalBridged)}
            unit=""
            graphic={<TotalBridgedGraphic />}
          />
          <StatWindow
            header={t`Weekly Rewards Header`}
            value={"100,000"}
            unit="USDS"
            graphic={<EstimatedRewardsGraphic />}
          />
          <StatWindow
            header={t`History of Rewards Earned Header`}
            value={formatInteger(historyRewardsEarned)}
            unit="USDS"
            graphic={<RewardHistoryGraphic />}
            infoElement={<Trans>History of Rewards Earned Tooltip</Trans>}
          />
        </div>
      </div>
    </div>
  );
};

const DisconnectedDashboard = () => {
  return (
    <div className="grow flex flex-col justify-center items-center gap-10">
      <div
        className="flex flex-col items-center gap-4
        bg-[#44457D] bg-opacity-30 backdrop-blur-lg
        rounded-lg
        pb-32 pt-8
        w-4/5
        px-4
        "
      >
        <div className="pb-2">
          <PortalLogo />
        </div>
        <div className="text-white text-3xl md:text-4xl pb-3">
          <Trans>Disconnect Wallet Dashboard Title</Trans>
        </div>
        <div className="flex flex-col items-center pb-8 w-5/6 md:w-1/1 ">
          <div className="text-white text-sm md:text-base w-1/1">
            <Trans>Disconnect Wallet Dashboard Subtitle One</Trans>
          </div>
          <div className="text-white text-sm md:text-base 2-1/1">
            <Trans>Disconnect Wallet Dashboard Subtitle Two</Trans>
          </div>
        </div>
        <WalletManager />
      </div>
      <div
        className="
        flex flex-col md:flex-row
        md:items-center gap-4
        bg-[#44457D] bg-opacity-30 backdrop-blur
        rounded-xl
        py-8
        px-8
        justify-between
        w-2/3
        "
      >
        <div
          className="
          flex flex-col md:flex-row md:items-center gap-4 md:gap-8
          text-start
          "
        >
          <Taurus />
          <div className="text-white text-2xl font-light">
            <Trans>Bottom Banner Header</Trans>
          </div>
        </div>
        <div>
          <a
            href="https://wormhole.foundation/blog/details-on-usds-rewards-for-solana-expansion"
            target="_blank"
            className="flex flex-row items-center gap-3"
          >
            <div className="text-white text-sm">
              <Trans>Bottom Banner Link</Trans>
            </div>
            <FaArrowRight className="fill-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout = () => {
  const { isConnected } = useAppKitAccount();
  return (
    <div className="flex flex-col flex-1">
      {isConnected ? <ConnectedDashboard /> : <DisconnectedDashboard />}
    </div>
  );
};
