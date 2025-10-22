# Experiences with KConfig

These are voices of several system-software project maintainers on KConfig (searched with public web search and via inspecting the project website).

## Linux: Kernel Practitioners

This is an excerpt from our [TOSEM paper](https://raw.githubusercontent.com/SoftVarE-Group/Papers/main/2025/2025-TOSEM-Kuiter.pdf) on the configurability of Linux.
Most of these experiences also relate to KConfig to some degree.

```
Kernel practitioners (such as developers, maintainers, or end users) are, to some degree, aware of variability-related issues in Linux.
For instance, developers discuss the difficulty of configuring Linux distributions for end users (https://lwn.net/Articles/507239/).
They also mention the negative impact of introducing too many features on code readability (https://lkml.org/lkml/2008/5/1/65).
Maintaining default configurations (https://lwn.net/Articles/391372/) and deciding on default values (https://lkml.org/lkml/2020/7/10/1261) are further challenges.
The relevance of feature location (https://lkml.org/lkml/2012/1/6/354) is another issue often discussed.
While many issues can be resolved with proper discussion, the kernel’s configuration language KConfig, its tools, and the complexity of the kernel itself are repeatedly criticized.
Developers comment: "There are simply already far too many [features] and they make the kernel harder and harder to change." https://lkml.org/lkml/2008/4/30/327
Another remark is that "the config subsystem has grown so large that it’s gotten out of control." https://lwn.net/Articles/733405/
Others add that "the config system is a nightmare." https://lwn.net/Articles/733405/
Linux Weekly News summarizes the situation as follows: "The kernel’s configuration system can be challenging to deal with; Linus Torvalds recently called it ‘one of the worst parts of the whole project.’ "But it is also a part that nobody is really working on; it receives a bit of maintenance, but there does not appear to be any significant effort out there to address its shortcomings. Two-hundred companies support work on each kernel development cycle, but none of them see the configuration system as one of the problems that they need to solve. Until that changes, we are likely to continue to see users struggling with it." - Jonathan Corbet (2017), co-founder and executive editor of Linux Weekly News (https://lwn.net/Articles/733405/)
```

## toybox: Rob Landley

https://github.com/landley/toybox/tree/master/kconfig

```
This is a snapshot of linux 2.6.12 kconfig as washed through busybox and
further modified by Rob Landley.

Note: The build infrastructure in this directory is still GPLv2. Cleaning
that out is a TODO item, but it doesn't affect the resulting binary.

Way back when I tried to push my local changes to kconfig upstream
in 2005 https://lwn.net/Articles/161086/
and 2006 http://lkml.iu.edu/hypermail/linux/kernel/0607.0/1805.html
and 2007 http://lkml.iu.edu/hypermail/linux/kernel/0707.1/1741.html
each of which spawned long "I think you should go do this and this and this
but I'm not going to lift a finger personally" threads from the kernel
developers. Twice I came back a year later to see if there was any interest
in what I _had_ done, and the third thread was the longest of the lot but
no code was merged as a result.

*shrug* That's the linux-kernel community for you. I had an easier time
than the author of squashfs, who spent 5 years actively trying to get his code
merged, finally quitting his job to spend an unpaid year working on upstreaming
squashfs _after_ after every major Linux distro had been locally carrying it
for years. No really, here's where he wrote about it himself:

https://lwn.net/Articles/563578/

This code is _going_away_. Rewriting it is low priority, but removing it is a
checklist item for the 1.0 toybox release. This directory contains the only
GPL code left in the tree, and none of its code winds up in the resulting
binary. It's just an editor that reads our Config.in files to update the top
level .config file; you can edit they by hand if you really want to.
```

http://lkml.iu.edu/hypermail/linux/kernel/0707.1/1741.html
(This code was never merged.)

```
Replace name "Linux Kernel" in menuconfig with a macro (defaulting to "Linux
Kernel" if not -Ddefined by the makefile), and remove a few unnecessary
occurrences of "kernel" in pop-up text.
--
This is the start of generally genericizing the kconfig infrastructure so it
builds more easily out of tree for other projects.

Lots of projects are already using menuconfig to configure themselves. Off
the top of my head, busybox, uClibc, buildroot, uClinux, my toybox project,
and several other things in the embedded space are already using it, plus a
few more like uboot are looking to start.)

Unfortunately, they have to grab a snapshot of the kernel version and apply
various modifications to it to build outside of kbuild, and those
modifications don't get passed back upstream. The version in the kernel is
the master that everybody periodically resyncs from, but they do a lot of work
each time they resync.

I've collected some of the changes uClibc and busybox made, as well as some
general cleanups I've done for the toybox version, and now I'm trying to feed
them back upstream. This patch is primarily cosmetic, there are more to come.
```

## Buildroot: Peter Korsgaard

https://youtu.be/0G_yJ50RA3I?t=287

```
The nice thing about [KConfig and Make] is that both of those technologies are technologies that you'll encounter anyway when you do embedded Linux systems.
So it's hard to get around not ever configuring the Linux kernel, so menuconfig is something you need to figure out to use anyway, and building any software without using make is also pretty difficult.
And of course none of these technologies are specific to Buildroot, so you had them already.
```
## Freetz-NG: Alexander Kriegisch

https://buildroot.uclibc.narkive.com/h0ophEJy/kconfig-how-to-implement-hierarchical-un-select-trees

```
I read the very concise, but nonetheless puzzling kconfig-language.txt
to understand how to optimise the awfully mis-structured menuconfig of a
project I am participating in. I experimented with an own set of minimal
Config.in files, but still do not understand the ins and outs of this tool.

Does anybody know of a tutorial (incl. samples!) for kconfig? What I
want to achieve is something like this:

[...]

I think I got this one working now. What disturbed my efforts were
double definitions of config variables in other Config.in includes at
unexpected places. (Did I mention the whole thing was a mess?) Sorry for
asking at all.

```

## BusyBox: Denys Vlasenko
## axTLS: Cameron Rich
## uClibc: Erik Andersen
## uClibc-ng: Waldemar Brodkorb
## EmbToolkit: Abdoulaye Walsimou Gaye
## L4Re: Alexander Warg, Adam Lackorzynski, Michael Hohmuth (Kernkonzept GmbH)
## Freetz-NG: Oliver Metz, fda77/fda89/cuma

(no public statements on KConfig found)
