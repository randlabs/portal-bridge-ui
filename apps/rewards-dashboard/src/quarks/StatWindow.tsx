import { InfoHover } from "./InfoIcon";

interface StatWindowProps {
  header: string;
  value?: string;
  unit?: string;
  graphic?: JSX.Element;
  infoElement?: JSX.Element;
}

const WindowBackground = "bg-[#44457D] bg-opacity-30 backdrop-blur-lg";

export const StatWindow = (props: StatWindowProps) => {
  const { unit, graphic, value, header, infoElement } = props;
  return (
    <div
      className={`
    ${WindowBackground}
    flex flex-row
    items-center
    rounded-lg
    pl-8
    justify-between
    `}
    >
      <div
        className="flex flex-col pr-8 gap-2
        "
      >
        <div className="flex flex-row items-center gap-2">
          <h4 className="text-white text-start whitespace-pre text-sm">
            {header}
          </h4>
          {infoElement ? (
            <InfoHover>
              <div className="prose text-[10px] text-white">{infoElement}</div>
            </InfoHover>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row items-end grow">
          {value ? (
            <div className="text-white whitespace-pre text-start font-bold text-2xl">
              {value}
            </div>
          ) : (
            <div
              className="
              w-full
              animate-pulse
              my-2 h-4 bg-gray-600 rounded-full grow
              "
            />
          )}
          {value && unit ? (
            <div className="pl-2 text-white text-sm whitespace-pre text-start">
              {unit}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {graphic || undefined}
    </div>
  );
};

interface InfoStatWindowProps {
  header: string;
  value?: string;
  unit?: string;
  infoElement?: JSX.Element;
  subtext?: string;
}
export const InfoStatWindow = (props: InfoStatWindowProps) => {
  const { unit, value, header, infoElement, subtext } = props;
  return (
    <div
      className={`
        flex flex-row flex-1
        ${WindowBackground}
        rounded-lg
        pl-7
        pr-4
        py-4
        justify-between
        `}
    >
      <div
        className="flex flex-col pr-8 w-full
        "
      >
        <div className="flex flex-row justify-start items-center">
          <h4 className="text-white text-start whitespace-pre text-sm">
            {header}
          </h4>
        </div>

        <div className="flex flex-row items-end">
          {value ? (
            <div className="text-white whitespace-pre text-start font-bold text-2xl">
              {value}
            </div>
          ) : (
            <div
              className="
              animate-pulse
              w-fill
              my-2
              h-4 bg-gray-600 rounded-full grow
              "
            />
          )}
          {value && unit ? (
            <div className="pl-2 text-white text-sm whitespace-pre text-start -translate-y-0.5">
              {unit}
            </div>
          ) : (
            ""
          )}
        </div>
        <p
          className={`${
            subtext === undefined
              ? "hidden"
              : "text-xs text-start text-white text-opacity-50"
          } `}
        >
          {subtext}
        </p>
      </div>
      <InfoHover>
        <div className="prose text-[10px] text-white">
          {infoElement ? infoElement : "Tooltip"}
        </div>
      </InfoHover>
    </div>
  );
};
