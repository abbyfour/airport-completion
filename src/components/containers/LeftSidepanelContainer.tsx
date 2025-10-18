import { Container } from "./Container";

export const LeftSidepanelContainer: Container = ({ children }) => {
  return (
    <div className="flex flex-col top-[90px] left-0 absolute items-start">
      {children}
    </div>
  );
};
