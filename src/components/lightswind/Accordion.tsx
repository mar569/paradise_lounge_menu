import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface AccordionContextType {
    value: string[];
    onValueChange: (value: string[]) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

interface AccordionItemContextType {
    value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string[]) => void;
    collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ className, type = "multiple", value, defaultValue = [], onValueChange, children, ...props }, ref) => {
        const [values, setValues] = React.useState<string[]>(
            Array.isArray(value) ? value : value ? [value] : Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
        );

        React.useEffect(() => {
            if (value !== undefined) {
                setValues(Array.isArray(value) ? value : value ? [value] : []);
            }
        }, [value]);

        const handleValueChange = React.useCallback((newValues: string[]) => {
            if (type === "single") {
                setValues(newValues.length > 0 ? [newValues[0]] : []);
            } else {
                setValues(newValues);
            }
            onValueChange?.(newValues);
        }, [onValueChange, type]);

        return (
            <AccordionContext.Provider value={{ value: values, onValueChange: handleValueChange }}>
                <div ref={ref} className={cn(className)} {...props}>
                    {children}
                </div>
            </AccordionContext.Provider>
        );
    }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ className, value, disabled = false, children, ...props }, ref) => {
        return (
            <AccordionItemContext.Provider value={{ value }}>
                <div
                    ref={ref}
                    className={cn("border-b text-black dark:text-white", className)}
                    data-state={disabled ? "disabled" : undefined}
                    data-value={value}
                    {...props}
                >
                    {children}
                </div>
            </AccordionItemContext.Provider>
        );
    }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type?: "single" | "multiple"; // Add type prop here
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ className, children, type, ...props }, ref) => {
        const context = React.useContext(AccordionContext);
        if (!context) throw new Error("AccordionTrigger must be used within an Accordion");

        const itemContext = React.useContext(AccordionItemContext);
        if (!itemContext) throw new Error("AccordionTrigger must be used within an AccordionItem");

        const { value: values, onValueChange } = context;
        const { value: itemValue } = itemContext;

        const isOpen = values.includes(itemValue);

        const handleToggle = () => {
            const newValues = isOpen
                ? values.filter(v => v !== itemValue)
                : type === "single"
                    ? [itemValue]
                    : [...values, itemValue];

            onValueChange(newValues);
        };

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    `flex flex-1 items-center justify-between cursor-pointer py-4 font-medium transition-all hover:underline 
          [&[data-state=open]>svg]:rotate-180`,
                    className
                )}
                onClick={handleToggle}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <motion.div
                    className="h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    data-state={isOpen ? "open" : "closed"}
                    aria-hidden
                    aria-expanded={isOpen}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </button>
        );
    }
);
AccordionTrigger.displayName = "AccordionTrigger";


interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
    ({ className, children, ...props }, ref) => {
        const context = React.useContext(AccordionContext);
        if (!context) throw new Error("AccordionContent must be used within an Accordion");
        const itemContext = React.useContext(AccordionItemContext);
        if (!itemContext) throw new Error("AccordionContent must be used within an AccordionItem");
        const { value: values } = context;
        const { value: itemValue } = itemContext;
        const isOpen = values.includes(itemValue);

        return (
            <motion.div
                ref={ref}
                className={cn("overflow-hidden text-sm transition-all duration-300 ease-in-out cursor-pointer", className)}
                initial={{ maxHeight: 0, opacity: 0 }} // Use maxHeight instead of height
                animate={{ maxHeight: isOpen ? '1000px' : 0, opacity: isOpen ? 1 : 0 }} // Set a large enough maxHeight
                exit={{ maxHeight: 0, opacity: 0 }}
                transition={{ duration: 0.9, }}
                {...props as Omit<AccordionContentProps, keyof HTMLMotionProps<"div">>} // Filter out incompatible properties
            >
                <div className={cn("pb-4 pt-0")}>
                    {children}
                </div>
            </motion.div>
        );
    }
);
AccordionContent.displayName = "AccordionContent";


export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
