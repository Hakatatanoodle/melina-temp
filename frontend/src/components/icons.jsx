/**
 * Minimal line icon set (design.md §11: consistent stroke, visually
 * subordinate to text). Each icon accepts a `size` and inherits `currentColor`.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ size = 18, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base} {...rest}>
      {children}
    </svg>
  );
}

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const CalendarIcon = (props) => (
  <Svg {...props}>
    <rect x="4" y="5.5" width="16" height="15" rx="3" />
    <path d="M4 10.5h16M8.5 3.5v4M15.5 3.5v4" />
  </Svg>
);

export const HeartIcon = (props) => (
  <Svg {...props}>
    <path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10Z" />
  </Svg>
);

export const EditIcon = (props) => (
  <Svg {...props}>
    <path d="M14.5 5.5 18.5 9.5M4 20l1-4.5L16.6 3.9a1.6 1.6 0 0 1 2.3 0l1.2 1.2a1.6 1.6 0 0 1 0 2.3L8.5 19 4 20Z" />
  </Svg>
);

export const TrashIcon = (props) => (
  <Svg {...props}>
    <path d="M4.5 6.5h15M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5M10 10.5v6M14 10.5v6" />
  </Svg>
);

export const KebabIcon = (props) => (
  <Svg {...props} strokeWidth={2.4}>
    <path d="M5.2 12h.01M12 12h.01M18.8 12h.01" />
  </Svg>
);

export const ArrowLeftIcon = (props) => (
  <Svg {...props}>
    <path d="M19 12H5M11.5 5.5 5 12l6.5 6.5" />
  </Svg>
);

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14M12.5 5.5 19 12l-6.5 6.5" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const LogoutIcon = (props) => (
  <Svg {...props}>
    <path d="M14 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h7M10 12h9.5M16 8.5l3.5 3.5L16 15.5" />
  </Svg>
);

export const UserIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20a7.6 7.6 0 0 1 14.4 0" />
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props} strokeWidth={2.2}>
    <path d="M4.5 12.5 10 18 19.5 7" />
  </Svg>
);

export const WarningIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4 2.8 19.5h18.4L12 4ZM12 10v4.4M12 17.2v.01" />
  </Svg>
);

/** Single subtle paw mark — used only in the "no pets" empty state. */
export const PawIcon = (props) => (
  <Svg {...props}>
    <ellipse cx="7" cy="8.4" rx="1.7" ry="2.2" />
    <ellipse cx="17" cy="8.4" rx="1.7" ry="2.2" />
    <ellipse cx="10.6" cy="5.6" rx="1.7" ry="2.3" />
    <ellipse cx="13.4" cy="5.6" rx="1.7" ry="2.3" />
    <path d="M12 12.2c2.8 0 5.2 2 5.2 4.2 0 1.5-1.2 2.6-2.8 2.6-.9 0-1.6-.4-2.4-.4s-1.5.4-2.4.4c-1.6 0-2.8-1.1-2.8-2.6 0-2.2 2.4-4.2 5.2-4.2Z" />
  </Svg>
);
