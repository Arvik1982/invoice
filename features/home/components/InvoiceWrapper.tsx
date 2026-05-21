import React, { ReactNode, FC, memo } from "react";
import Footer from "../components/Footer";
import InvoiceTitle from "./InvoiceTitle";
import ScreenScrollContainer from "@/shared/components/ScreenScrollContainer";

type Props = {
  children: ReactNode;
};
const InvoiceWrapper: FC<Props> = ({ children }) => {
  return (
    <ScreenScrollContainer stickyHeaderIndices={[0]}>
      <InvoiceTitle />
      {children}
      <Footer />
    </ScreenScrollContainer>
  );
};

export default memo(InvoiceWrapper);
