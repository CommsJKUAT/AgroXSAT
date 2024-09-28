const Modal = () => {
  return (
    <div
      id="dropdown-cta"
      class="absolute top-14 right-10 w-80 p-4 mt-6 rounded-lg bg-black-olive"
      role="alert"
    >
      <div class="flex items-center mb-3">
        <button
          type="button"
          class="ms-auto -mx-1.5 -my-1.5 inline-flex justify-center items-center w-6 h-6 text-olive rounded-lg focus:ring-2 p-1"
          data-dismiss-target="#dropdown-cta"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-2.5 h-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
      <div>{/* Content here */}</div>
    </div>
  );
};

export default Modal;
