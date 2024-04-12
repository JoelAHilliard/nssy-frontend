import { portfolio_data } from "@/preact-service";
import QRCode from "react-qr-code";


const PortQRCode = () => {
    return (
        <QRCode
            size={56}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={JSON.stringify(portfolio_data.value)}
            viewBox={`0 0 256 256`}
        />
    )
}

export default PortQRCode;