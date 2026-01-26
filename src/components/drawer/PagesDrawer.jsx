import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
import { X } from "lucide-react";
import Category from "@components/category/Category";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PagesDrawer = ({ open, setOpen, categories, categoryError }) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 z-40 flex">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">

              {/* ====================== HEADER ====================== */}
              <div className="flex px-4 pb-2 pt-2 items-center justify-between">
                
                {/* LEFT — CLOSE BUTTON */}
                <button
                  type="button"
                  className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* CENTER — LOGO */}
                {/* <div className="flex flex-1 justify-center">
                  <Link href="/" className="flex items-center">
                    <img
                      className="h-16 w-auto"   // Bigger logo
                      src="/logo/azli_logos-01.png"
                      alt="MyAzliFresh"
                    />
                  </Link>
                </div> */}

                {/* RIGHT — PLACEHOLDER TO BALANCE THE LOGO */}
                <div className="w-10"></div>
              </div>

              {/* ====================== TABS ====================== */}
              <TabGroup as="div" className="mt-2 flex flex-col h-full">
                
                {/* TAB BUTTONS */}
                <div className="border-b border-gray-200">
                  <TabList className="-mb-px flex space-x-8 px-4">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-900",
                          "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                        )
                      }
                    >
                      Category
                    </Tab>
                  </TabList>
                </div>

                {/* TAB PANELS */}
                <TabPanels className="flex-1 overflow-y-auto px-4 py-6">
                  
                  {/* CATEGORY TAB PANEL */}
                  <TabPanel>
                    <div className="space-y-6">
                      <div className="rounded-md overflow-y-auto max-h-[65vh] scrollbar-hide">
                        <Category
                          categories={categories}
                          categoryError={categoryError}
                          onClose={() => setOpen(false)}
                        />
                      </div>
                    </div>
                  </TabPanel>

                </TabPanels>
              </TabGroup>

            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PagesDrawer;
