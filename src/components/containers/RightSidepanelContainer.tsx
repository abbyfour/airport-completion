import { Container } from "./Container";

export const RightSidepanelContainer: Container = ({ children }) => {
  return (
    <div className="flex flex-col top-0 right-0 absolute items-start">
      {children}
    </div>
  );
};
