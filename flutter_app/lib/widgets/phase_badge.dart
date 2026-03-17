import 'package:flutter/material.dart';

class PhaseBadge extends StatelessWidget {
  final String phase;
  final String currentPhase;

  const PhaseBadge({
    Key? key,
    required this.phase,
    required this.currentPhase,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isActive = phase.toLowerCase() == currentPhase.toLowerCase();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isActive ? Colors.white24 : Colors.transparent,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        phase,
        style: TextStyle(
          color: isActive ? Colors.white : Colors.white54,
          fontSize: 11,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}
