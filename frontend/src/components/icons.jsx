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

/* --- onboarding wizard: species + field adornment icons (same stroke system) --- */

export const DogIcon = (props) => (
  <Svg {...props}>
    <path d="M6 4.5c-1.6.6-2.4 2-2.2 3.9L5 14l-1 4.2a1.5 1.5 0 0 0 2.6 1.3L8.5 17h7l1.9 2.5a1.5 1.5 0 0 0 2.6-1.3L19 14l1.2-5.6c.2-1.9-.6-3.3-2.2-3.9-1-.4-2 .1-2.5.9L14.6 6H9.4l-.9-.6c-.5-.8-1.5-1.3-2.5-.9Z" />
    <circle cx="9.5" cy="11" r=".4" />
    <circle cx="14.5" cy="11" r=".4" />
    <path d="M10.8 14.2c.4.5.8.7 1.2.7s.8-.2 1.2-.7" />
  </Svg>
);

export const CatIcon = (props) => (
  <Svg {...props}>
    <path d="M5 4.5 7 6.4c1.2-.8 2.5-1.2 5-1.2s3.8.4 5 1.2l2-1.9-1 4.9c.7 1.3 1 2.6 1 3.6 0 4-3.3 7.5-7 7.5s-7-3.5-7-7.5c0-1 .3-2.3 1-3.6l-1-4.9Z" />
    <path d="M9.5 12.5v.01M14.5 12.5v.01M10.6 15.4c.4.4.9.6 1.4.6s1-.2 1.4-.6" />
  </Svg>
);

export const RabbitIcon = (props) => (
  <Svg {...props}>
    <path d="M8.5 3.5c-1.2.3-1.9 1.6-1.6 3.4l.9 4.6c-1.6.7-2.8 2.3-2.8 4.2 0 2.6 2.2 4.8 5 4.8h2c2.8 0 5-2.2 5-4.8 0-1.9-1.2-3.5-2.8-4.2l.9-4.6c.3-1.8-.4-3.1-1.6-3.4-1-.3-2 .4-2.4 1.5l-.6 1.6-.6-1.6c-.4-1.1-1.4-1.8-2.4-1.5Z" />
    <path d="M10 13v.01M14 13v.01" />
  </Svg>
);

export const BirdIcon = (props) => (
  <Svg {...props}>
    <path d="M15 4c-3 0-5.2 2.2-5.4 5.2L5 11l3.4.8c.5 3.4 2.9 6 6.1 6.5L19 20.5l-.6-3.3c1.2-1 2-2.6 2.1-4.7L15 4Z" />
    <circle cx="12.6" cy="8.6" r=".5" />
    <path d="M9.6 9.2 7 8.4M13 14.5c.8.3 1.7.3 2.5-.1" />
  </Svg>
);

export const SmallPetIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="13" r="7" />
    <path d="M5.6 8.6C5 7.4 5.1 6 6 5.2c.8-.7 2-.3 2.5.8M18.4 8.6c.6-1.2.5-2.6-.4-3.4-.8-.7-2-.3-2.5.8" />
    <circle cx="9.6" cy="12.4" r=".4" />
    <circle cx="14.4" cy="12.4" r=".4" />
    <path d="M11 15.2c.3.3.6.5 1 .5s.7-.2 1-.5" />
  </Svg>
);

export const OtherIcon = (props) => (
  <Svg {...props}>
    <ellipse cx="7" cy="8.4" rx="1.7" ry="2.2" />
    <ellipse cx="17" cy="8.4" rx="1.7" ry="2.2" />
    <ellipse cx="10.6" cy="5.6" rx="1.7" ry="2.3" />
    <ellipse cx="13.4" cy="5.6" rx="1.7" ry="2.3" />
    <path d="M12 12.2c2.8 0 5.2 2 5.2 4.2 0 1.5-1.2 2.6-2.8 2.6-.9 0-1.6-.4-2.4-.4s-1.5.4-2.4.4c-1.6 0-2.8-1.1-2.8-2.6 0-2.2 2.4-4.2 5.2-4.2Z" />
  </Svg>
);

export const PetFaceIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="7.5" />
    <path d="M7.5 8.5C6.4 7 6.3 5.4 7.2 4.6c.8-.7 2.2-.2 3 1.2M16.5 8.5c1.1-1.5 1.2-3.1.3-3.9-.8-.7-2.2-.2-3 1.2" />
    <circle cx="9.7" cy="12" r=".4" />
    <circle cx="14.3" cy="12" r=".4" />
    <path d="M11 14.4h2l-1 1.4-1-1.4Z" />
  </Svg>
);

export const GenderIcon = (props) => (
  <Svg {...props}>
    <circle cx="10" cy="14" r="5.5" />
    <path d="M14 10V4.5M14 4.5h5.5M14 4.5l-1.6 1.6M17.5 15.5l3 3M20.5 15.5v3h-3" />
  </Svg>
);

export const BreedIcon = (props) => (
  <Svg {...props}>
    <path d="M5 20.5v-15L3.6 7M5 5.5h5M10 5.5 8.6 7M14 20.5v-9l3 4.5 3-4.5v9M6 15h11" />
  </Svg>
);

export const BirthdayIcon = (props) => (
  <Svg {...props}>
    <rect x="4.5" y="10" width="15" height="9.5" rx="2.5" />
    <path d="M12 10v9.5M12 10c0-2.8 1-4.5 2.6-5.3M12 10c0-2.8-1-4.5-2.6-5.3M12 10c-2.2-.6-4.4-.3-5.8.8M12 10c2.2-.6 4.4-.3 5.8.8" />
  </Svg>
);
