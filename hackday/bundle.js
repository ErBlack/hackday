
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Timer.svelte generated by Svelte v3.12.1 */

    function create_fragment(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text(ctx.status);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.status) {
    				set_data_dev(t, ctx.status);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function d2(v) {
    		return ('0' + v).substr(-2);
    }

    function plural(n, f) {n %= 100; if (n > 10 && n < 20) return f[2]; n %= 10; return f[n > 1 && n < 5 ? 1 : n === 1 ? 0 : 2]}

    function instance($$self, $$props, $$invalidate) {
    	let { start } = $$props;
    	const INTERVALS = [1000, 60, 60, 24, 7];

    	function offset(start, from = new Date()) {
    		let offset = (start - from);
    		let direction = offset > 0 ? 1 : offset < 0 ? -1 : 0;

    		offset = Math.abs(offset);

    		let result = INTERVALS.map(function(value) {
    			var result = offset % value;

    			offset = (offset - result) / value;

    			return result;
    		});

    		return {
    			milliseconds: result[0],
    			seconds: result[1],
    			minutes: result[2],
    			hours: result[3],
    			days: result[4],
    			weeks: offset,
    			direction: direction
    		};
    	}

    	let status;	

    	function iterate() {
    		$$invalidate('status', status = render());

    		if (offset(start).direction !== 1) {
    			return;
    		}

    		setTimeout(iterate, 1000);
    	}
    	iterate();

    	function render() {
    		const {
    			direction,
    			weeks,
    			days,
    			hours,
    			minutes,
    			seconds
    		} = offset(start);


    		if (direction === 1) {
    			const result = [];

    			if (weeks) {
    				result.push(weeks + ' ' + plural(weeks, ['неделю', 'недели', 'недель']));
    			}
    			if (days) {
    				result.push(days + ' ' + plural(days, ['день', 'дня', 'дней']));
    			}

    			return `${result.join(' ')} ${d2(hours)}ч ${d2(minutes)}м ${d2(seconds)}с`;
    		} else {
    			return 'Времени не осталось';
    		}
    	}

    	const writable_props = ['start'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Timer> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('start' in $$props) $$invalidate('start', start = $$props.start);
    	};

    	$$self.$capture_state = () => {
    		return { start, status };
    	};

    	$$self.$inject_state = $$props => {
    		if ('start' in $$props) $$invalidate('start', start = $$props.start);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	return { start, status };
    }

    class Timer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["start"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Timer", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.start === undefined && !('start' in props)) {
    			console.warn("<Timer> was created without expected prop 'start'");
    		}
    	}

    	get start() {
    		throw new Error("<Timer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<Timer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Hello.svelte generated by Svelte v3.12.1 */

    const file = "src/Hello.svelte";

    function create_fragment$1(ctx) {
    	var h2, span0, span1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			span0 = element("span");
    			span0.textContent = "Hello";
    			span1 = element("span");
    			span1.textContent = "_";
    			attr_dev(span0, "class", "hello svelte-mqcctd");
    			add_location(span0, file, 0, 4, 4);
    			attr_dev(span1, "class", "_ svelte-mqcctd");
    			add_location(span1, file, 0, 36, 36);
    			attr_dev(h2, "class", "svelte-mqcctd");
    			add_location(h2, file, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, span0);
    			append_dev(h2, span1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    class Hello extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Hello", options, id: create_fragment$1.name });
    	}
    }

    /* src/Typewriter.svelte generated by Svelte v3.12.1 */

    const file$1 = "src/Typewriter.svelte";

    function create_fragment$2(ctx) {
    	var div, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div = element("div");

    			if (default_slot) default_slot.c();

    			attr_dev(div, "class", "typewriter svelte-1x0moc6");
    			add_location(div, file$1, 15, 0, 225);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(div_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { $$slots, $$scope };
    }

    class Typewriter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Typewriter", options, id: create_fragment$2.name });
    	}
    }

    /* src/Links.svelte generated by Svelte v3.12.1 */

    const file$2 = "src/Links.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.icon = list[i].icon;
    	child_ctx.text = list[i].text;
    	child_ctx.href = list[i].href;
    	return child_ctx;
    }

    // (99:57) <Typewriter>
    function create_default_slot(ctx) {
    	var a, t_value = ctx.text + "", t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", ctx.href);
    			attr_dev(a, "class", "svelte-166a2us");
    			add_location(a, file$2, 98, 69, 3224);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(99:57) <Typewriter>", ctx });
    	return block;
    }

    // (98:1) {#each links as { icon, text, href }}
    function create_each_block(ctx) {
    	var div, span, raw_value = ctx.icon + "", t, current;

    	var typewriter = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = space();
    			typewriter.$$.fragment.c();
    			attr_dev(span, "class", "icon svelte-166a2us");
    			add_location(span, file$2, 98, 18, 3173);
    			attr_dev(div, "class", "row svelte-166a2us");
    			add_location(div, file$2, 98, 1, 3156);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			span.innerHTML = raw_value;
    			append_dev(div, t);
    			mount_component(typewriter, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var typewriter_changes = {};
    			if (changed.$$scope) typewriter_changes.$$scope = { changed, ctx };
    			typewriter.$set(typewriter_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(typewriter);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(98:1) {#each links as { icon, text, href }}", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var div, current;

    	let each_value = ctx.links;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(div, file$2, 96, 0, 3110);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.links) {
    				each_value = ctx.links;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self) {
    	const links = [
    		{
    			icon: '<svg width="1em"fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M462.3 62.7c-54.5-46.4-136-38.7-186.6 13.5L256 96.6l-19.7-20.3C195.5 34.1 113.2 8.7 49.7 62.7c-62.8 53.6-66.1 149.8-9.9 207.8l193.5 199.8c6.2 6.4 14.4 9.7 22.6 9.7 8.2 0 16.4-3.2 22.6-9.7L472 270.5c56.4-58 53.1-154.2-9.7-207.8zm-13.1 185.6L256.4 448.1 62.8 248.3c-38.4-39.6-46.4-115.1 7.7-161.2 54.8-46.8 119.2-12.9 142.8 11.5l42.7 44.1 42.7-44.1c23.2-24 88.2-58 142.8-11.5 54 46 46.1 121.5 7.7 161.2z"/></svg>',
    			text: 'Вишлист',
    			href: 'https://yandex.ru/collections/user/erblack/_wishlist/'
    		},
    		{
    			icon: '<svg width="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 464c-119.1 0-216-96.9-216-216S128.9 40 248 40s216 96.9 216 216-96.9 216-216 216zm0-312c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 160c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm0-88c-13.2 0-24 10.8-24 24s10.8 24 24 24 24-10.8 24-24-10.8-24-24-24zm-8-144c-88.2 0-160 71.8-160 160h32c0-70.6 57.4-128 128-128V88z"/></svg>',
    			text: 'Пластинки',
    			href: 'https://www.discogs.com/wantlist?user=ErBlack'
    		},
    		{
    			icon: '<svg width="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"/></svg>',
    			text: 'Чат',
    			href: 'https://t.me/joinchat/AnHOJhXRaP9pF74nxXB8Dg'
    		}
    	];

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { links };
    }

    class Links extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Links", options, id: create_fragment$3.name });
    	}
    }

    /* src/Twitter.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/Twitter.svelte";

    // (14:1) <Typewriter>
    function create_default_slot$1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("@ErBlack");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$1.name, type: "slot", source: "(14:1) <Typewriter>", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var a, current;

    	var typewriter = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			a = element("a");
    			typewriter.$$.fragment.c();
    			attr_dev(a, "href", "https://twitter.com/ErBlack");
    			attr_dev(a, "class", "svelte-19p9jme");
    			add_location(a, file$3, 12, 0, 176);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(typewriter, a, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var typewriter_changes = {};
    			if (changed.$$scope) typewriter_changes.$$scope = { changed, ctx };
    			typewriter.$set(typewriter_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}

    			destroy_component(typewriter);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    class Twitter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Twitter", options, id: create_fragment$4.name });
    	}
    }

    /* src/Copyright.svelte generated by Svelte v3.12.1 */

    const file$4 = "src/Copyright.svelte";

    // (16:1) <Typewriter>
    function create_default_slot$2(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("©2019");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$2.name, type: "slot", source: "(16:1) <Typewriter>", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var span, current;

    	var typewriter = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			span = element("span");
    			typewriter.$$.fragment.c();
    			attr_dev(span, "class", "svelte-1hyycpn");
    			add_location(span, file$4, 14, 0, 214);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(typewriter, span, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var typewriter_changes = {};
    			if (changed.$$scope) typewriter_changes.$$scope = { changed, ctx };
    			typewriter.$set(typewriter_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span);
    			}

    			destroy_component(typewriter);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    class Copyright extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Copyright", options, id: create_fragment$5.name });
    	}
    }

    const ERROR_COMMAND_NOT_FOUND = (command) => `-bash: ${command}: command not found`;

    class Command {
        exec(command) {
            switch (command) {
                default:
                    return ERROR_COMMAND_NOT_FOUND(command);
            }
        }
    }

    /* src/Terminal.svelte generated by Svelte v3.12.1 */

    const file$5 = "src/Terminal.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.command = list[i].command;
    	child_ctx.result = list[i].result;
    	return child_ctx;
    }

    // (35:0) {#each bash_history as {command, result}}
    function create_each_block$1(ctx) {
    	var div0, t0, t1_value = ctx.command + "", t1, t2, div1, t3_value = ctx.result + "", t3;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("> ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			attr_dev(div0, "class", "row");
    			add_location(div0, file$5, 35, 4, 589);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$5, 36, 4, 628);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.bash_history) && t1_value !== (t1_value = ctx.command + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if ((changed.bash_history) && t3_value !== (t3_value = ctx.result + "")) {
    				set_data_dev(t3, t3_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    				detach_dev(t2);
    				detach_dev(div1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(35:0) {#each bash_history as {command, result}}", ctx });
    	return block;
    }

    function create_fragment$6(ctx) {
    	var t0, form, t1, input, dispose;

    	let each_value = ctx.bash_history;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			form = element("form");
    			t1 = text("> ");
    			input = element("input");
    			attr_dev(input, "name", "command");
    			attr_dev(input, "class", "svelte-ppluv3");
    			add_location(input, file$5, 39, 2, 698);
    			add_location(form, file$5, 38, 0, 668);
    			dispose = listen_dev(form, "submit", ctx.onSubmit);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, t1);
    			append_dev(form, input);
    		},

    		p: function update(changed, ctx) {
    			if (changed.bash_history) {
    				each_value = ctx.bash_history;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(form);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const command = new Command();

    let bash_history = [];

    function onSubmit(e) {
        e.preventDefault();

        const value = e.target.command.value;

        if (value === '') return;

        $$invalidate('bash_history', bash_history = bash_history.concat({
            command: value,
            result: command.exec(value)
        }));
        e.target.command.value = '';
    }

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('bash_history' in $$props) $$invalidate('bash_history', bash_history = $$props.bash_history);
    	};

    	return { bash_history, onSubmit };
    }

    class Terminal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$6, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Terminal", options, id: create_fragment$6.name });
    	}
    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file$6 = "src/App.svelte";

    // (40:1) <Typewriter>
    function create_default_slot_5(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Приглашаю на день рождения");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_5.name, type: "slot", source: "(40:1) <Typewriter>", ctx });
    	return block;
    }

    // (42:1) <Typewriter>
    function create_default_slot_4(ctx) {
    	var t_value = ctx.start.toLocaleString().slice(0, -3) + "", t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_4.name, type: "slot", source: "(42:1) <Typewriter>", ctx });
    	return block;
    }

    // (44:1) <Typewriter>
    function create_default_slot_3(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Приходите через");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_3.name, type: "slot", source: "(44:1) <Typewriter>", ctx });
    	return block;
    }

    // (46:1) <Typewriter>
    function create_default_slot_2(ctx) {
    	var current;

    	var timer = new Timer({
    		props: { start: ctx.start },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			timer.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(timer, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(timer.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(timer.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(timer, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_2.name, type: "slot", source: "(46:1) <Typewriter>", ctx });
    	return block;
    }

    // (49:1) <Typewriter>
    function create_default_slot_1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Проспект Александровской Фермы 8");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(49:1) <Typewriter>", ctx });
    	return block;
    }

    // (52:2) <Typewriter>
    function create_default_slot$3(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("7 парадная, 22 этаж, Квартира 1268");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$3.name, type: "slot", source: "(52:2) <Typewriter>", ctx });
    	return block;
    }

    function create_fragment$7(ctx) {
    	var link, t0, div1, t1, t2, br0, t3, t4, br1, t5, t6, br2, t7, t8, br3, t9, br4, t10, t11, br5, t12, div0, t13, br6, t14, br7, t15, t16, br8, t17, t18, t19, current;

    	var hello = new Hello({ $$inline: true });

    	var typewriter0 = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot_5] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var typewriter1 = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot_4] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var typewriter2 = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var typewriter3 = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var typewriter4 = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var typewriter5 = new Typewriter({
    		props: {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var links = new Links({ $$inline: true });

    	var terminal = new Terminal({ $$inline: true });

    	var twitter = new Twitter({ $$inline: true });

    	var copyright = new Copyright({ $$inline: true });

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			div1 = element("div");
    			hello.$$.fragment.c();
    			t1 = space();
    			typewriter0.$$.fragment.c();
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			typewriter1.$$.fragment.c();
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			typewriter2.$$.fragment.c();
    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			typewriter3.$$.fragment.c();
    			t8 = space();
    			br3 = element("br");
    			t9 = space();
    			br4 = element("br");
    			t10 = space();
    			typewriter4.$$.fragment.c();
    			t11 = space();
    			br5 = element("br");
    			t12 = space();
    			div0 = element("div");
    			typewriter5.$$.fragment.c();
    			t13 = space();
    			br6 = element("br");
    			t14 = space();
    			br7 = element("br");
    			t15 = space();
    			links.$$.fragment.c();
    			t16 = space();
    			br8 = element("br");
    			t17 = space();
    			terminal.$$.fragment.c();
    			t18 = space();
    			twitter.$$.fragment.c();
    			t19 = space();
    			copyright.$$.fragment.c();
    			attr_dev(link, "href", "https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap⊂=cyrillic");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$6, 11, 0, 364);
    			add_location(br0, file$6, 40, 1, 1155);
    			add_location(br1, file$6, 42, 1, 1226);
    			add_location(br2, file$6, 44, 1, 1275);
    			add_location(br3, file$6, 46, 1, 1331);
    			add_location(br4, file$6, 47, 1, 1338);
    			add_location(br5, file$6, 49, 1, 1404);
    			attr_dev(div0, "class", "address svelte-12ux2ax");
    			add_location(div0, file$6, 50, 1, 1411);
    			add_location(br6, file$6, 53, 1, 1504);
    			add_location(br7, file$6, 54, 1, 1511);
    			add_location(br8, file$6, 56, 1, 1528);
    			add_location(div1, file$6, 37, 0, 1085);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, link, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(hello, div1, null);
    			append_dev(div1, t1);
    			mount_component(typewriter0, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			mount_component(typewriter1, div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, br1);
    			append_dev(div1, t5);
    			mount_component(typewriter2, div1, null);
    			append_dev(div1, t6);
    			append_dev(div1, br2);
    			append_dev(div1, t7);
    			mount_component(typewriter3, div1, null);
    			append_dev(div1, t8);
    			append_dev(div1, br3);
    			append_dev(div1, t9);
    			append_dev(div1, br4);
    			append_dev(div1, t10);
    			mount_component(typewriter4, div1, null);
    			append_dev(div1, t11);
    			append_dev(div1, br5);
    			append_dev(div1, t12);
    			append_dev(div1, div0);
    			mount_component(typewriter5, div0, null);
    			append_dev(div1, t13);
    			append_dev(div1, br6);
    			append_dev(div1, t14);
    			append_dev(div1, br7);
    			append_dev(div1, t15);
    			mount_component(links, div1, null);
    			append_dev(div1, t16);
    			append_dev(div1, br8);
    			append_dev(div1, t17);
    			mount_component(terminal, div1, null);
    			append_dev(div1, t18);
    			mount_component(twitter, div1, null);
    			append_dev(div1, t19);
    			mount_component(copyright, div1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var typewriter0_changes = {};
    			if (changed.$$scope) typewriter0_changes.$$scope = { changed, ctx };
    			typewriter0.$set(typewriter0_changes);

    			var typewriter1_changes = {};
    			if (changed.$$scope) typewriter1_changes.$$scope = { changed, ctx };
    			typewriter1.$set(typewriter1_changes);

    			var typewriter2_changes = {};
    			if (changed.$$scope) typewriter2_changes.$$scope = { changed, ctx };
    			typewriter2.$set(typewriter2_changes);

    			var typewriter3_changes = {};
    			if (changed.$$scope) typewriter3_changes.$$scope = { changed, ctx };
    			typewriter3.$set(typewriter3_changes);

    			var typewriter4_changes = {};
    			if (changed.$$scope) typewriter4_changes.$$scope = { changed, ctx };
    			typewriter4.$set(typewriter4_changes);

    			var typewriter5_changes = {};
    			if (changed.$$scope) typewriter5_changes.$$scope = { changed, ctx };
    			typewriter5.$set(typewriter5_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(hello.$$.fragment, local);

    			transition_in(typewriter0.$$.fragment, local);

    			transition_in(typewriter1.$$.fragment, local);

    			transition_in(typewriter2.$$.fragment, local);

    			transition_in(typewriter3.$$.fragment, local);

    			transition_in(typewriter4.$$.fragment, local);

    			transition_in(typewriter5.$$.fragment, local);

    			transition_in(links.$$.fragment, local);

    			transition_in(terminal.$$.fragment, local);

    			transition_in(twitter.$$.fragment, local);

    			transition_in(copyright.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(hello.$$.fragment, local);
    			transition_out(typewriter0.$$.fragment, local);
    			transition_out(typewriter1.$$.fragment, local);
    			transition_out(typewriter2.$$.fragment, local);
    			transition_out(typewriter3.$$.fragment, local);
    			transition_out(typewriter4.$$.fragment, local);
    			transition_out(typewriter5.$$.fragment, local);
    			transition_out(links.$$.fragment, local);
    			transition_out(terminal.$$.fragment, local);
    			transition_out(twitter.$$.fragment, local);
    			transition_out(copyright.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(link);
    				detach_dev(t0);
    				detach_dev(div1);
    			}

    			destroy_component(hello);

    			destroy_component(typewriter0);

    			destroy_component(typewriter1);

    			destroy_component(typewriter2);

    			destroy_component(typewriter3);

    			destroy_component(typewriter4);

    			destroy_component(typewriter5);

    			destroy_component(links);

    			destroy_component(terminal);

    			destroy_component(twitter);

    			destroy_component(copyright);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self) {
    	
    	
    	const start = new Date('2019-10-12T11:00:00.000Z');

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { start };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$7.name });
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
