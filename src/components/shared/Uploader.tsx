import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import type { UploadCtxProvider } from '@uploadcare/react-uploader';

interface UploaderProps {
  onUpload?: (url: string) => void;
  className?: string;
}

export default function Uploader({ onUpload, className = '' }: UploaderProps) {
  return (
    <div className={className}>
      <FileUploaderRegular
        pubkey="ba0aa723c64ce755dde6"
        classNameUploader="uc-light uc-purple"
        sourceList="local, camera, gdrive, facebook"
        userAgentIntegration="llm-react"
        filesViewMode="grid"
        onFileUploadSuccess={(e: any) => {
          if (onUpload && e?.cdnUrl) {
            onUpload(e.cdnUrl);
          }
        }}
      />
    </div>
  );
}
