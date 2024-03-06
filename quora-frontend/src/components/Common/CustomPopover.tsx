import { Popover } from '@mui/material';
import HoverCards from '../Cards/HoverCards';
import { useEffect, useState } from 'react';

const CustomPopover = ({
  anchorEl,
  setAnchorEl,
  currentTab,
  data,
}: {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  currentTab: string;
  data: any;
}) => {
  const open = Boolean(anchorEl);
  const [mousePos, setMousePos] = useState<any>();

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return (
    <>
      {mousePos && (
        <Popover
          anchorReference="anchorPosition"
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorPosition={{ top: mousePos?.y, left: mousePos?.x }}
          onClose={() => {
            setAnchorEl(null);
          }}
          disableRestoreFocus
        >
          <HoverCards currentTab={currentTab} data={data} />
        </Popover>
      )}
    </>
  );
};

export default CustomPopover;
